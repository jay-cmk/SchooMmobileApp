import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import api from "../../../api/axios";

/* =====================================================
   TYPES
===================================================== */

type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE"
  | "HALF_DAY";

interface RelationItem {
  _id?: string;
  id?: string;

  name?: string;
  title?: string;
  code?: string;
}

interface SubjectAssignment {
  _id?: string;
  id?: string;

  academicSessionId?:
    | string
    | RelationItem;

  sessionId?:
    | string
    | RelationItem;

  classId?:
    | string
    | RelationItem;

  class?:
    | string
    | RelationItem;

  sectionId?:
    | string
    | RelationItem;

  section?:
    | string
    | RelationItem;

  subjectId?:
    | string
    | RelationItem;

  subject?:
    | string
    | RelationItem;

  weeklyPeriods?: number;

  isActive?: boolean;
}

interface AssignmentGroup {
  key: string;

  sessionId: string;
  classId: string;
  sectionId: string;

  sessionName: string;
  className: string;
  sectionName: string;

  subjects: string[];
}

interface Student {
  _id?: string;
  id?: string;

  name?: string;

  firstName?: string;
  lastName?: string;

  admissionNumber?: string;

  rollNumber?:
    | number
    | string;

  profileImage?: string;

  status?: string;
}

interface AttendanceRecord {
  _id?: string;
  id?: string;

  studentId?:
    | string
    | Student;

  status?: AttendanceStatus;

  remarks?: string;

  date?: string;
}

interface StudentAttendanceItem {
  studentId: string;

  name: string;

  admissionNumber: string;

  rollNumber?: number | string;

  status: AttendanceStatus;

  remarks: string;

  attendanceId?: string;
}

/* =====================================================
   STATUS CONFIG
===================================================== */

const ATTENDANCE_STATUSES: {
  value: AttendanceStatus;
  label: string;
  shortLabel: string;
  backgroundClass: string;
  activeClass: string;
}[] = [
  {
    value: "PRESENT",
    label: "Present",
    shortLabel: "P",
    backgroundClass:
      "bg-[#E7F7F1]",
    activeClass:
      "bg-[#2BAA7B]",
  },

  {
    value: "ABSENT",
    label: "Absent",
    shortLabel: "A",
    backgroundClass:
      "bg-[#FDECEE]",
    activeClass:
      "bg-[#DC4C5A]",
  },

  {
    value: "LEAVE",
    label: "Leave",
    shortLabel: "L",
    backgroundClass:
      "bg-[#FFF2DE]",
    activeClass:
      "bg-[#E59A2F]",
  },

  {
    value: "HALF_DAY",
    label: "Half Day",
    shortLabel: "HD",
    backgroundClass:
      "bg-[#F5ECFF]",
    activeClass:
      "bg-[#8B5CF6]",
  },
];

/* =====================================================
   HELPERS
===================================================== */

const getApiData = (
  response: any
): any => {
  return (
    response?.data?.data ??
    response?.data ??
    null
  );
};

const extractArray = (
  data: any,
  keys: string[]
): any[] => {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of keys) {
    if (
      Array.isArray(
        data?.[key]
      )
    ) {
      return data[key];
    }
  }

  return [];
};

/* =====================================================
   RELATION ID
===================================================== */

const getId = (
  value: unknown
): string => {
  if (!value) {
    return "";
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    typeof value ===
    "object"
  ) {
    const item =
      value as RelationItem;

    return (
      item._id ??
      item.id ??
      ""
    );
  }

  return "";
};

/* =====================================================
   RELATION NAME
===================================================== */

const getName = (
  value: unknown
): string => {
  if (!value) {
    return "";
  }

  if (
    typeof value ===
    "string"
  ) {
    return "";
  }

  if (
    typeof value ===
    "object"
  ) {
    const item =
      value as RelationItem;

    return (
      item.name ??
      item.title ??
      item.code ??
      ""
    );
  }

  return "";
};

/* =====================================================
   STUDENT NAME
===================================================== */

const getStudentName = (
  student: Student
): string => {
  if (student.name) {
    return student.name;
  }

  const fullName = [
    student.firstName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    fullName ||
    "Student"
  );
};

/* =====================================================
   LOCAL YYYY-MM-DD
===================================================== */

const formatDate = (
  date: Date
): string => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(
    2,
    "0"
  );

  const day = String(
    date.getDate()
  ).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
};

/* =====================================================
   DISPLAY DATE
===================================================== */

const displayDate = (
  date: Date
): string => {
  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/* =====================================================
   DATE CHANGE
===================================================== */

const changeDate = (
  date: Date,
  amount: number
): Date => {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() +
      amount
  );

  return result;
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherAttendanceScreen =
  () => {
    /* =================================================
       STATE
    ================================================= */

    const [
      assignments,
      setAssignments,
    ] = useState<
      SubjectAssignment[]
    >([]);

    const [
      selectedGroupKey,
      setSelectedGroupKey,
    ] = useState("");

    const [
      selectedDate,
      setSelectedDate,
    ] = useState(
      new Date()
    );

    const [
      students,
      setStudents,
    ] = useState<
      StudentAttendanceItem[]
    >([]);

    const [
      initialLoading,
      setInitialLoading,
    ] = useState(true);

    const [
      studentsLoading,
      setStudentsLoading,
    ] = useState(false);

    const [
      saving,
      setSaving,
    ] = useState(false);

    const [
      refreshing,
      setRefreshing,
    ] = useState(false);

    const [
      error,
      setError,
    ] = useState<
      string | null
    >(null);

    const [
      existingAttendance,
      setExistingAttendance,
    ] = useState(false);

    /* =================================================
       GROUP ASSIGNMENTS
    ================================================= */

    const assignmentGroups =
      useMemo<
        AssignmentGroup[]
      >(() => {
        const map =
          new Map<
            string,
            AssignmentGroup
          >();

        assignments.forEach(
          (assignment) => {
            const sessionValue =
              assignment
                .academicSessionId ??
              assignment.sessionId;

            const classValue =
              assignment.classId ??
              assignment.class;

            const sectionValue =
              assignment.sectionId ??
              assignment.section;

            const subjectValue =
              assignment.subjectId ??
              assignment.subject;

            const sessionId =
              getId(
                sessionValue
              );

            const classId =
              getId(
                classValue
              );

            const sectionId =
              getId(
                sectionValue
              );

            if (
              !sessionId ||
              !classId ||
              !sectionId
            ) {
              return;
            }

            const key =
              `${sessionId}-${classId}-${sectionId}`;

            const subjectName =
              getName(
                subjectValue
              );

            const existing =
              map.get(key);

            if (existing) {
              if (
                subjectName &&
                !existing.subjects.includes(
                  subjectName
                )
              ) {
                existing.subjects.push(
                  subjectName
                );
              }

              return;
            }

            map.set(key, {
              key,

              sessionId,
              classId,
              sectionId,

              sessionName:
                getName(
                  sessionValue
                ) ||
                "Session",

              className:
                getName(
                  classValue
                ) ||
                "Class",

              sectionName:
                getName(
                  sectionValue
                ) ||
                "Section",

              subjects:
                subjectName
                  ? [
                      subjectName,
                    ]
                  : [],
            });
          }
        );

        return Array.from(
          map.values()
        );
      }, [assignments]);

    /* =================================================
       SELECTED GROUP
    ================================================= */

    const selectedGroup =
      useMemo(() => {
        return (
          assignmentGroups.find(
            (item) =>
              item.key ===
              selectedGroupKey
          ) ?? null
        );
      }, [
        assignmentGroups,
        selectedGroupKey,
      ]);

    /* =================================================
       ATTENDANCE STATS
    ================================================= */

    const stats =
      useMemo(() => {
        const result = {
          total:
            students.length,

          present: 0,
          absent: 0,
          leave: 0,
          halfDay: 0,
        };

        students.forEach(
          (student) => {
            switch (
              student.status
            ) {
              case "PRESENT":
                result.present +=
                  1;
                break;

              case "ABSENT":
                result.absent +=
                  1;
                break;

              case "LEAVE":
                result.leave +=
                  1;
                break;

              case "HALF_DAY":
                result.halfDay +=
                  1;
                break;
            }
          }
        );

        return result;
      }, [students]);

    /* =================================================
       LOAD ASSIGNMENTS
    ================================================= */

    const fetchAssignments =
      useCallback(
        async () => {
          try {
            setError(null);

            const response =
              await api.get(
                "/academic/subject-assignments/teacher/me"
              );

            const data =
              getApiData(
                response
              );

            const list =
              extractArray(
                data,
                [
                  "assignments",
                  "subjectAssignments",
                  "subjects",
                  "data",
                ]
              );

            setAssignments(
              list
            );
          } catch (
            err: any
          ) {
            console.log(
              "TEACHER ATTENDANCE ASSIGNMENTS ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response
                ?.data
                ?.message ??
                "Assigned classes load nahi ho saki."
            );
          }
        },
        []
      );

    /* =================================================
       INITIAL LOAD
    ================================================= */

    useEffect(() => {
      const initialize =
        async () => {
          try {
            setInitialLoading(
              true
            );

            await fetchAssignments();
          } finally {
            setInitialLoading(
              false
            );
          }
        };

      initialize();
    }, [
      fetchAssignments,
    ]);

    /* =================================================
       SELECT FIRST GROUP
    ================================================= */

    useEffect(() => {
      if (
        !selectedGroupKey &&
        assignmentGroups.length >
          0
      ) {
        setSelectedGroupKey(
          assignmentGroups[0]
            .key
        );
      }
    }, [
      assignmentGroups,
      selectedGroupKey,
    ]);

    /* =================================================
       LOAD STUDENTS + ATTENDANCE
    ================================================= */

    const fetchStudentsAndAttendance =
      useCallback(
        async (
          group: AssignmentGroup,
          date: Date
        ) => {
          try {
            setStudentsLoading(
              true
            );

            setError(null);

            setExistingAttendance(
              false
            );

            const dateValue =
              formatDate(date);

            /* =========================================
               STUDENTS
            ========================================= */

            const studentResponse =
              await api.get(
                "/students",
                {
                  params: {
                    sessionId:
                      group.sessionId,

                    classId:
                      group.classId,

                    sectionId:
                      group.sectionId,

                    status:
                      "ACTIVE",

                    limit:
                      100,
                  },
                }
              );

            const studentData =
              getApiData(
                studentResponse
              );

            const studentList =
              extractArray(
                studentData,
                [
                  "students",
                  "data",
                ]
              );

            /*
             * Student controller returns:
             *
             * {
             *   success: true,
             *   data: [...]
             * }
             *
             * getApiData already returns data,
             * so Array case bhi handle hai.
             */

            const parsedStudents: Student[] =
              Array.isArray(
                studentData
              )
                ? studentData
                : studentList;

            /* =========================================
               EXISTING ATTENDANCE
            ========================================= */

            let attendanceRecords: AttendanceRecord[] =
              [];

            try {
              const attendanceResponse =
                await api.get(
                  "/attendance",
                  {
                    params: {
                      sessionId:
                        group.sessionId,

                      classId:
                        group.classId,

                      sectionId:
                        group.sectionId,

                      date:
                        dateValue,
                    },
                  }
                );

              const attendanceData =
                getApiData(
                  attendanceResponse
                );

              attendanceRecords =
                extractArray(
                  attendanceData,
                  [
                    "attendance",
                    "records",
                    "data",
                  ]
                );

              setExistingAttendance(
                attendanceRecords.length >
                  0
              );
            } catch (
              attendanceError: any
            ) {
              console.log(
                "EXISTING ATTENDANCE ERROR:",
                attendanceError
                  ?.response
                  ?.data ??
                  attendanceError
                    ?.message
              );

              /*
               * Students still show even if
               * attendance fetch fails.
               */
            }

            /* =========================================
               ATTENDANCE MAP
            ========================================= */

            const attendanceMap =
              new Map<
                string,
                AttendanceRecord
              >();

            attendanceRecords.forEach(
              (record) => {
                const studentId =
                  getId(
                    record.studentId
                  );

                if (studentId) {
                  attendanceMap.set(
                    studentId,
                    record
                  );
                }
              }
            );

            /* =========================================
               MERGE
            ========================================= */

            const merged: StudentAttendanceItem[] =
              parsedStudents
                .map(
                  (
                    student
                  ) => {
                    const studentId =
                      student._id ??
                      student.id ??
                      "";

                    if (
                      !studentId
                    ) {
                      return null;
                    }

                    const existing =
                      attendanceMap.get(
                        studentId
                      );

                    const item: StudentAttendanceItem =
                      {
                        studentId,

                        name:
                          getStudentName(
                            student
                          ),

                        admissionNumber:
                          student.admissionNumber ??
                          "-",

                        status:
                          existing?.status ??
                          "PRESENT",

                        remarks:
                          existing?.remarks ??
                          "",
                      };

                    if (
                      student.rollNumber !==
                      undefined
                    ) {
                      item.rollNumber =
                        student.rollNumber;
                    }

                    const attendanceId =
                      existing?._id ??
                      existing?.id;

                    if (
                      attendanceId
                    ) {
                      item.attendanceId =
                        attendanceId;
                    }

                    return item;
                  }
                )
                .filter(
                  (
                    item
                  ): item is StudentAttendanceItem =>
                    item !==
                    null
                );

            merged.sort(
              (a, b) => {
                const aRoll =
                  Number(
                    a.rollNumber ??
                      999999
                  );

                const bRoll =
                  Number(
                    b.rollNumber ??
                      999999
                  );

                return (
                  aRoll -
                  bRoll
                );
              }
            );

            setStudents(
              merged
            );
          } catch (
            err: any
          ) {
            console.log(
              "TEACHER ATTENDANCE STUDENTS ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setStudents([]);

            setError(
              err?.response
                ?.data
                ?.message ??
                "Students load nahi ho sake."
            );
          } finally {
            setStudentsLoading(
              false
            );
          }
        },
        []
      );

    /* =================================================
       GROUP / DATE CHANGE
    ================================================= */

    useEffect(() => {
      if (
        selectedGroup
      ) {
        fetchStudentsAndAttendance(
          selectedGroup,
          selectedDate
        );
      }
    }, [
      selectedGroup,
      selectedDate,
      fetchStudentsAndAttendance,
    ]);

    /* =================================================
       CHANGE STATUS
    ================================================= */

    const handleStatusChange =
      (
        studentId: string,
        status: AttendanceStatus
      ) => {
        setStudents(
          (previous) =>
            previous.map(
              (student) =>
                student.studentId ===
                studentId
                  ? {
                      ...student,
                      status,
                    }
                  : student
            )
        );
      };

    /* =================================================
       REMARKS
    ================================================= */

    const handleRemarksChange =
      (
        studentId: string,
        remarks: string
      ) => {
        setStudents(
          (previous) =>
            previous.map(
              (student) =>
                student.studentId ===
                studentId
                  ? {
                      ...student,
                      remarks,
                    }
                  : student
            )
        );
      };

    /* =================================================
       MARK ALL PRESENT
    ================================================= */

    const markAllPresent =
      () => {
        setStudents(
          (previous) =>
            previous.map(
              (student) => ({
                ...student,

                status:
                  "PRESENT",
              })
            )
        );
      };

    /* =================================================
       SAVE ATTENDANCE
    ================================================= */

    const saveAttendance =
      async () => {
        if (
          !selectedGroup
        ) {
          Alert.alert(
            "Class required",
            "Please select a class and section."
          );

          return;
        }

        if (
          students.length ===
          0
        ) {
          Alert.alert(
            "No students",
            "Is class/section me koi active student nahi mila."
          );

          return;
        }

        try {
          setSaving(true);

          setError(null);

          const attendance =
            students.map(
              (student) => {
                const item: {
                  studentId: string;

                  status:
                    AttendanceStatus;

                  remarks?: string;
                } = {
                  studentId:
                    student.studentId,

                  status:
                    student.status,
                };

                const remarks =
                  student.remarks.trim();

                if (remarks) {
                  item.remarks =
                    remarks;
                }

                return item;
              }
            );

          await api.post(
            "/attendance/bulk",
            {
              sessionId:
                selectedGroup.sessionId,

              classId:
                selectedGroup.classId,

              sectionId:
                selectedGroup.sectionId,

              date:
                formatDate(
                  selectedDate
                ),

              attendance,
            }
          );

          setExistingAttendance(
            true
          );

          Alert.alert(
            "Success",
            existingAttendance
              ? "Attendance updated successfully."
              : "Attendance saved successfully."
          );

          await fetchStudentsAndAttendance(
            selectedGroup,
            selectedDate
          );
        } catch (
          err: any
        ) {
          console.log(
            "SAVE ATTENDANCE ERROR:",
            err?.response
              ?.data ??
              err?.message
          );

          const message =
            err?.response?.data
              ?.message ??
            "Attendance save nahi ho saki.";

          setError(
            message
          );

          Alert.alert(
            "Attendance Error",
            message
          );
        } finally {
          setSaving(false);
        }
      };

    /* =================================================
       REFRESH
    ================================================= */

    const handleRefresh =
      async () => {
        try {
          setRefreshing(
            true
          );

          await fetchAssignments();

          if (
            selectedGroup
          ) {
            await fetchStudentsAndAttendance(
              selectedGroup,
              selectedDate
            );
          }
        } finally {
          setRefreshing(
            false
          );
        }
      };

    /* =================================================
       TODAY
    ================================================= */

    const goToToday =
      () => {
        setSelectedDate(
          new Date()
        );
      };

    /* =================================================
       FUTURE DATE
    ================================================= */

    const isToday =
      formatDate(
        selectedDate
      ) ===
      formatDate(
        new Date()
      );

    /* =================================================
       INITIAL LOADING
    ================================================= */

    if (
      initialLoading
    ) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

            <Ionicons
              name="checkmark-done-outline"
              size={30}
              color="#4355D8"
            />

          </View>

          <ActivityIndicator
            className="mt-5"
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-semibold text-[#606F88]">
            Loading attendance...
          </Text>

        </SafeAreaView>
      );
    }

    /* =================================================
       UI
    ================================================= */

    return (
      <SafeAreaView
        edges={[
          "top",
          "left",
          "right",
        ]}
        className="flex-1 bg-[#F7F7FB]"
      >

        {/* ============================================
            HEADER
        ============================================ */}

        <View className="bg-[#4355D8] px-5 pb-7 pt-5">

          <Text className="text-2xl font-extrabold text-white">
            Attendance
          </Text>

          <Text className="mt-1 text-xs text-white/70">
            Mark and manage
            student attendance
          </Text>

        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="pb-32"
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor="#4355D8"
            />
          }
        >

          {/* ==========================================
              ASSIGNMENT / CLASS SELECT
          ========================================== */}

          <View className="px-5 pt-5">

            <Text className="text-sm font-extrabold text-[#15213B]">
              Select Class
            </Text>

            {assignmentGroups.length >
            0 ? (
              <ScrollView
                horizontal
                className="mt-3"
                showsHorizontalScrollIndicator={
                  false
                }
              >

                {assignmentGroups.map(
                  (group) => {
                    const selected =
                      group.key ===
                      selectedGroupKey;

                    return (
                      <Pressable
                        key={
                          group.key
                        }
                        onPress={() =>
                          setSelectedGroupKey(
                            group.key
                          )
                        }
                        className={`mr-3 min-w-[155px] rounded-2xl border p-4 ${
                          selected
                            ? "border-[#4355D8] bg-[#4355D8]"
                            : "border-[#E5E8F0] bg-white"
                        }`}
                      >

                        <Text
                          className={`text-base font-extrabold ${
                            selected
                              ? "text-white"
                              : "text-[#15213B]"
                          }`}
                        >
                          {
                            group.className
                          }
                        </Text>

                        <Text
                          className={`mt-1 text-xs font-semibold ${
                            selected
                              ? "text-white/80"
                              : "text-[#606F88]"
                          }`}
                        >
                          Section{" "}
                          {
                            group.sectionName
                          }
                        </Text>

                        {group.subjects.length >
                        0 ? (
                          <Text
                            numberOfLines={
                              1
                            }
                            className={`mt-2 text-[10px] ${
                              selected
                                ? "text-white/70"
                                : "text-[#606F88]"
                            }`}
                          >
                            {group.subjects.join(
                              ", "
                            )}
                          </Text>
                        ) : null}

                      </Pressable>
                    );
                  }
                )}

              </ScrollView>
            ) : (
              <View className="mt-3 rounded-2xl border border-dashed border-[#D8DDEA] bg-white p-5">

                <Text className="text-center text-sm font-semibold text-[#606F88]">
                  No assigned
                  classes found.
                </Text>

              </View>
            )}

          </View>

          {/* ==========================================
              DATE
          ========================================== */}

          <View className="px-5 pt-5">

            <View className="rounded-2xl border border-[#E5E8F0] bg-white p-4">

              <View className="flex-row items-center justify-between">

                <Pressable
                  onPress={() =>
                    setSelectedDate(
                      (
                        previous
                      ) =>
                        changeDate(
                          previous,
                          -1
                        )
                    )
                  }
                  className="h-10 w-10 items-center justify-center rounded-xl bg-[#F4F5FA]"
                >
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color="#15213B"
                  />
                </Pressable>

                <Pressable
                  onPress={
                    goToToday
                  }
                  className="items-center"
                >

                  <Text className="text-[10px] font-extrabold tracking-wider text-[#606F88]">
                    ATTENDANCE DATE
                  </Text>

                  <Text className="mt-1 text-sm font-extrabold text-[#15213B]">
                    {displayDate(
                      selectedDate
                    )}
                  </Text>

                  {!isToday ? (
                    <Text className="mt-1 text-[10px] font-bold text-[#4355D8]">
                      Tap for Today
                    </Text>
                  ) : (
                    <Text className="mt-1 text-[10px] font-bold text-[#2BAA7B]">
                      Today
                    </Text>
                  )}

                </Pressable>

                <Pressable
                  onPress={() =>
                    setSelectedDate(
                      (
                        previous
                      ) =>
                        changeDate(
                          previous,
                          1
                        )
                    )
                  }
                  className="h-10 w-10 items-center justify-center rounded-xl bg-[#F4F5FA]"
                >
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#15213B"
                  />
                </Pressable>

              </View>

            </View>

          </View>

          {/* ==========================================
              EXISTING BADGE
          ========================================== */}

          {existingAttendance ? (
            <View className="px-5 pt-4">

              <View className="flex-row items-center rounded-xl bg-[#EEF0FF] px-4 py-3">

                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#4355D8"
                />

                <Text className="ml-2 flex-1 text-xs font-semibold text-[#4355D8]">
                  Is date ki
                  attendance already
                  saved hai. Aap
                  changes karke dobara
                  save kar sakte hain.
                </Text>

              </View>

            </View>
          ) : null}

          {/* ==========================================
              ERROR
          ========================================== */}

          {error ? (
            <View className="px-5 pt-4">

              <View className="flex-row items-center rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

                <Ionicons
                  name="alert-circle-outline"
                  size={20}
                  color="#DC4C5A"
                />

                <Text className="ml-2 flex-1 text-xs font-medium text-[#DC4C5A]">
                  {error}
                </Text>

              </View>

            </View>
          ) : null}

          {/* ==========================================
              STATS
          ========================================== */}

          {selectedGroup ? (
            <View className="px-5 pt-5">

              <View className="flex-row gap-2">

                <View className="flex-1 rounded-2xl bg-white p-3">

                  <Text className="text-[9px] font-extrabold text-[#606F88]">
                    TOTAL
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#15213B]">
                    {stats.total}
                  </Text>

                </View>

                <View className="flex-1 rounded-2xl bg-[#E7F7F1] p-3">

                  <Text className="text-[9px] font-extrabold text-[#2BAA7B]">
                    PRESENT
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#2BAA7B]">
                    {stats.present}
                  </Text>

                </View>

                <View className="flex-1 rounded-2xl bg-[#FDECEE] p-3">

                  <Text className="text-[9px] font-extrabold text-[#DC4C5A]">
                    ABSENT
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#DC4C5A]">
                    {stats.absent}
                  </Text>

                </View>

                <View className="flex-1 rounded-2xl bg-[#FFF2DE] p-3">

                  <Text className="text-[9px] font-extrabold text-[#E59A2F]">
                    LEAVE
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#E59A2F]">
                    {stats.leave}
                  </Text>

                </View>

              </View>

            </View>
          ) : null}

          {/* ==========================================
              STUDENT HEADER
          ========================================== */}

          {selectedGroup ? (
            <View className="mt-6 flex-row items-center justify-between px-5">

              <View>

                <Text className="text-lg font-extrabold text-[#15213B]">
                  Students
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  {
                    selectedGroup.className
                  }{" "}
                  • Section{" "}
                  {
                    selectedGroup.sectionName
                  }
                </Text>

              </View>

              {students.length >
              0 ? (
                <Pressable
                  onPress={
                    markAllPresent
                  }
                  className="flex-row items-center rounded-xl bg-[#E7F7F1] px-3 py-2.5"
                >

                  <Ionicons
                    name="checkmark-done"
                    size={16}
                    color="#2BAA7B"
                  />

                  <Text className="ml-1.5 text-[10px] font-extrabold text-[#2BAA7B]">
                    All Present
                  </Text>

                </Pressable>
              ) : null}

            </View>
          ) : null}

          {/* ==========================================
              STUDENT LOADING
          ========================================== */}

          {studentsLoading ? (
            <View className="items-center py-14">

              <ActivityIndicator
                size="large"
                color="#4355D8"
              />

              <Text className="mt-3 text-xs font-semibold text-[#606F88]">
                Loading students...
              </Text>

            </View>
          ) : null}

          {/* ==========================================
              STUDENT LIST
          ========================================== */}

          {!studentsLoading &&
          students.length > 0 ? (
            <View className="px-5 pt-4">

              {students.map(
                (
                  student,
                  index
                ) => (
                  <View
                    key={
                      student.studentId
                    }
                    className="mb-4 rounded-3xl border border-[#E5E8F0] bg-white p-4"
                  >

                    {/* STUDENT INFO */}

                    <View className="flex-row items-center">

                      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                        <Text className="text-sm font-extrabold text-[#4355D8]">
                          {student.name
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </Text>

                      </View>

                      <View className="ml-3 flex-1">

                        <Text className="text-sm font-extrabold text-[#15213B]">
                          {student.name}
                        </Text>

                        <Text className="mt-1 text-[10px] text-[#606F88]">
                          Roll No:{" "}
                          {student.rollNumber ??
                            "-"}{" "}
                          •{" "}
                          {
                            student.admissionNumber
                          }
                        </Text>

                      </View>

                      <View className="h-8 min-w-8 items-center justify-center rounded-lg bg-[#F4F5FA] px-2">

                        <Text className="text-[10px] font-extrabold text-[#606F88]">
                          {index +
                            1}
                        </Text>

                      </View>

                    </View>

                    {/* STATUS */}

                    <View className="mt-4 flex-row gap-2">

                      {ATTENDANCE_STATUSES.map(
                        (
                          statusItem
                        ) => {
                          const active =
                            student.status ===
                            statusItem.value;

                          return (
                            <Pressable
                              key={
                                statusItem.value
                              }
                              onPress={() =>
                                handleStatusChange(
                                  student.studentId,
                                  statusItem.value
                                )
                              }
                              className={`flex-1 items-center rounded-xl py-3 ${
                                active
                                  ? statusItem.activeClass
                                  : statusItem.backgroundClass
                              }`}
                            >

                              <Text
                                className={`text-[11px] font-extrabold ${
                                  active
                                    ? "text-white"
                                    : "text-[#606F88]"
                                }`}
                              >
                                {
                                  statusItem.shortLabel
                                }
                              </Text>

                            </Pressable>
                          );
                        }
                      )}

                    </View>

                    {/* LABEL */}

                    <View className="mt-2 flex-row justify-between px-1">

                      <Text className="text-[8px] text-[#606F88]">
                        Present
                      </Text>

                      <Text className="text-[8px] text-[#606F88]">
                        Absent
                      </Text>

                      <Text className="text-[8px] text-[#606F88]">
                        Leave
                      </Text>

                      <Text className="text-[8px] text-[#606F88]">
                        Half Day
                      </Text>

                    </View>

                    {/* REMARKS */}

                    <TextInput
                      value={
                        student.remarks
                      }
                      onChangeText={(
                        value
                      ) =>
                        handleRemarksChange(
                          student.studentId,
                          value
                        )
                      }
                      placeholder="Add remarks (optional)"
                      placeholderTextColor="#9AA4B5"
                      className="mt-4 rounded-xl bg-[#F7F7FB] px-4 py-3 text-xs text-[#15213B]"
                    />

                  </View>
                )
              )}

            </View>
          ) : null}

          {/* ==========================================
              EMPTY
          ========================================== */}

          {!studentsLoading &&
          selectedGroup &&
          students.length ===
            0 ? (
            <View className="mx-5 mt-5 items-center rounded-3xl border border-dashed border-[#D8DDEA] bg-white px-5 py-10">

              <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                <Ionicons
                  name="people-outline"
                  size={30}
                  color="#4355D8"
                />

              </View>

              <Text className="mt-4 text-base font-extrabold text-[#15213B]">
                No students found
              </Text>

              <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
                Is class aur
                section me koi
                active student
                nahi mila.
              </Text>

            </View>
          ) : null}

        </ScrollView>

        {/* ============================================
            SAVE BUTTON
        ============================================ */}

        {selectedGroup &&
        students.length > 0 ? (
          <View className="absolute bottom-0 left-0 right-0 border-t border-[#E5E8F0] bg-white px-5 pb-5 pt-3">

            <Pressable
              disabled={
                saving
              }
              onPress={
                saveAttendance
              }
              className={`flex-row items-center justify-center rounded-2xl py-4 ${
                saving
                  ? "bg-[#9BA4E8]"
                  : "bg-[#4355D8]"
              }`}
            >

              {saving ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <Ionicons
                  name="checkmark-circle-outline"
                  size={21}
                  color="#FFFFFF"
                />
              )}

              <Text className="ml-2 text-sm font-extrabold text-white">
                {saving
                  ? "Saving..."
                  : existingAttendance
                    ? "Update Attendance"
                    : "Save Attendance"}
              </Text>

            </Pressable>

          </View>
        ) : null}

      </SafeAreaView>
    );
  };

export default TeacherAttendanceScreen;