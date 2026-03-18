"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [studentName, setStudentName] = useState("");
  const router = useRouter();
  const [todayStatus, setTodayStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialize = async () => {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        router.push("/login");
        return;
      }

      const userId = sessionData.session.user.id;

      // Get user's school_id
      const { data: userData } = await supabase
        .from("users")
        .select("school_id")
        .eq("id", userId)
        .single();

      if (userData) {
        setSchoolId(userData.school_id);
        await fetchStudents();
        await fetchAttendance();
      }

      setLoading(false);
    };

    initialize();
  }, []);

  const fetchStudents = async () => {
    const { data } = await supabase
      .from("students")
      .select("*");

    setStudents(data || []);
  };

  const fetchAttendance = async () => {
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("attendance")
    .select(`
      id,
      date,
      status,
      student_id,
      students ( name )
    `)
    .eq("date", today);

  const statusMap: { [key: string]: string } = {};

  data?.forEach((record) => {
    statusMap[record.student_id] = record.status;
  });

  setTodayStatus(statusMap);
  setAttendance(data || []);
};

  const addStudent = async () => {
    if (!schoolId) return;

    await supabase.from("students").insert([
      {
        name: studentName,
        school_id: schoolId,
      },
    ]);

    setStudentName("");
    fetchStudents();
  };

  const markAttendance = async (studentId: string, status: string) => {
  if (!schoolId) return;

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("attendance")
    .upsert(
      {
        student_id: studentId,
        school_id: schoolId,
        date: today,
        status: status,
      },
      {
        onConflict: "student_id,date",
      }
    );

  if (error) {
    console.error(error.message);
  }

  fetchAttendance();
};

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <button
          onClick={addStudent}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Student
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Students</h2>
      <ul>
  {students.map((student) => {
    const current = todayStatus[student.id];

    return (
      <li key={student.id} className="mb-2">
        {student.name}

        <button
          onClick={() => markAttendance(student.id, "present")}
          className={`ml-3 px-2 py-1 rounded ${
            current === "present"
              ? "bg-green-800 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          Present
        </button>

        <button
          onClick={() => markAttendance(student.id, "absent")}
          className={`ml-2 px-2 py-1 rounded ${
            current === "absent"
              ? "bg-red-800 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          Absent
        </button>
      </li>
    );
  })}
</ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        Attendance Records
      </h2>

      <ul>
  {attendance.map((record) => (
    <li key={record.id}>
      {record.students?.name} — {record.date} — {record.status}
    </li>
  ))}
</ul>
    </div>
  );
}