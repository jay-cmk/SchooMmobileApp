import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
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

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import type {
  RouteProp,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import api from "../../../api/axios";

import type {
  TeacherStackParamList,
} from "types/navigation.types";


// ======================================================
// NAVIGATION
// ======================================================

type NavigationProp =
  NativeStackNavigationProp<
    TeacherStackParamList,
    "HomeworkReview"
  >;

type ReviewRouteProp =
  RouteProp<
    TeacherStackParamList,
    "HomeworkReview"
  >;


// ======================================================
// TYPES
// ======================================================

type SubmissionMode =
  | "ONLINE"
  | "OFFLINE";

type SubmissionStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "LATE";

type ReviewStatus =
  | "PENDING"
  | "COMPLETED"
  | "INCOMPLETE"
  | "REDO_REQUIRED"
  | "REVIEWED";

type FinalReviewStatus =
  | "COMPLETED"
  | "INCOMPLETE"
  | "REDO_REQUIRED";


interface RelationItem {
  _id?: string;

  id?: string;

  name?: string;

  firstName?: string;

  lastName?: string;

  admissionNumber?: string;

  rollNumber?:
    | string
    | number;

  email?: string;
}


interface Student {
  _id?: string;

  id?: string;

  name?: string;

  firstName?: string;

  lastName?: string;

  admissionNumber?: string;

  rollNumber?:
    | string
    | number;

  status?: string;
}


interface Attachment {
  fileName?: string;

  fileUrl?: string;

  fileType?: string;

  fileSize?: number;
}


interface HomeworkSubmission {
  _id?: string;

  id?: string;

  studentId?:
    | string
    | RelationItem;

  homeworkId?:
    | string
    | RelationItem;

  submissionMode?:
    SubmissionMode;

  submissionText?: string;

  attachment?: Attachment;

  submissionStatus?:
    SubmissionStatus;

  reviewStatus?:
    ReviewStatus;

  submittedAt?: string;

  reviewedAt?: string;

  reviewedBy?:
    | string
    | RelationItem;

  remarks?: string;

  marks?: number;

  isActive?: boolean;
}


interface SubmissionStats {
  homeworkId?: string;

  totalStudents: number;

  totalRecords: number;

  onlineSubmitted: number;

  offlineChecked: number;

  pendingStudents: number;

  onTimeSubmitted: number;

  lateSubmitted: number;

  completed: number;

  incomplete: number;

  redoRequired: number;

  pendingReview: number;

  legacyReviewed: number;
}


interface StudentReviewRow {
  student: Student;

  studentId: string;

  submission:
    HomeworkSubmission | null;
}


type FilterType =
  | "ALL"
  | "PENDING"
  | "COMPLETED"
  | "INCOMPLETE"
  | "REDO_REQUIRED"
  | "ONLINE"
  | "OFFLINE";


interface BulkSelection {
  studentId: string;

  reviewStatus:
    FinalReviewStatus;
}


// ======================================================
// API DATA
// ======================================================

const getApiData = (
  response: any
): any => {
  return (
    response?.data?.data ??
    response?.data ??
    null
  );
};


// ======================================================
// EXTRACT ARRAY
// ======================================================

const extractArray = (
  value: any,
  keys: string[]
): any[] => {
  if (
    Array.isArray(
      value
    )
  ) {
    return value;
  }

  for (
    const key of keys
  ) {
    if (
      Array.isArray(
        value?.[key]
      )
    ) {
      return value[key];
    }
  }

  return [];
};


// ======================================================
// GET ID
// ======================================================

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


// ======================================================
// STUDENT ID
// ======================================================

const getStudentId = (
  student: Student
): string => {
  return (
    student._id ??
    student.id ??
    ""
  );
};


// ======================================================
// STUDENT NAME
// ======================================================

const getStudentName = (
  student:
    | Student
    | RelationItem
    | null
    | undefined
): string => {
  if (!student) {
    return "Student";
  }

  if (
    student.name
  ) {
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


// ======================================================
// DATE
// ======================================================

const formatDateTime = (
  value?: string
): string => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(
      value
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
};


// ======================================================
// FILE SIZE
// ======================================================

const formatFileSize = (
  bytes?: number
): string => {
  if (
    bytes === undefined ||
    bytes === null
  ) {
    return "";
  }

  if (
    bytes < 1024
  ) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(
      1
    )} KB`;
  }

  return `${(
    bytes /
    (
      1024 *
      1024
    )
  ).toFixed(
    1
  )} MB`;
};


// ======================================================
// REVIEW UI
// ======================================================

const getReviewUI = (
  status?: ReviewStatus
) => {
  switch (
    status
  ) {
    case "COMPLETED":
      return {
        label:
          "COMPLETED",

        container:
          "bg-[#E7F7F1]",

        text:
          "text-[#2BAA7B]",

        icon:
          "checkmark-circle" as const,

        iconColor:
          "#2BAA7B",
      };

    case "INCOMPLETE":
      return {
        label:
          "INCOMPLETE",

        container:
          "bg-[#FDECEE]",

        text:
          "text-[#DC4C5A]",

        icon:
          "close-circle" as const,

        iconColor:
          "#DC4C5A",
      };

    case "REDO_REQUIRED":
      return {
        label:
          "REDO",

        container:
          "bg-[#FFF2DE]",

        text:
          "text-[#E59A2F]",

        icon:
          "refresh-circle" as const,

        iconColor:
          "#E59A2F",
      };

    case "REVIEWED":
      return {
        label:
          "REVIEWED",

        container:
          "bg-[#EEF0FF]",

        text:
          "text-[#4355D8]",

        icon:
          "checkmark-done-circle" as const,

        iconColor:
          "#4355D8",
      };

    default:
      return {
        label:
          "TO REVIEW",

        container:
          "bg-[#FFF2DE]",

        text:
          "text-[#E59A2F]",

        icon:
          "time" as const,

        iconColor:
          "#E59A2F",
      };
  }
};


// ======================================================
// SCREEN
// ======================================================

const TeacherHomeworkReviewScreen =
  () => {
    const navigation =
      useNavigation<
        NavigationProp
      >();

    const route =
      useRoute<
        ReviewRouteProp
      >();

    const {
      homeworkId,
      sessionId,
      classId,
      sectionId,
      homeworkTitle,
    } = route.params;


    // ==================================================
    // DATA
    // ==================================================

    const [
      students,
      setStudents,
    ] = useState<
      Student[]
    >([]);


    const [
      submissions,
      setSubmissions,
    ] = useState<
      HomeworkSubmission[]
    >([]);


    const [
      stats,
      setStats,
    ] = useState<
      SubmissionStats | null
    >(null);


    const [
      loading,
      setLoading,
    ] = useState(
      true
    );


    const [
      refreshing,
      setRefreshing,
    ] = useState(
      false
    );


    const [
      error,
      setError,
    ] = useState<
      string | null
    >(null);


    // ==================================================
    // FILTER
    // ==================================================

    const [
      filter,
      setFilter,
    ] = useState<
      FilterType
    >("ALL");


    // ==================================================
    // SINGLE REVIEW
    // ==================================================

    const [
      selectedRow,
      setSelectedRow,
    ] = useState<
      StudentReviewRow | null
    >(null);


    const [
      selectedReviewStatus,
      setSelectedReviewStatus,
    ] = useState<
      FinalReviewStatus | null
    >(null);


    const [
      remarks,
      setRemarks,
    ] = useState("");


    const [
      marks,
      setMarks,
    ] = useState("");


    const [
      reviewing,
      setReviewing,
    ] = useState(
      false
    );


    // ==================================================
    // BULK
    // ==================================================

    const [
      bulkSelections,
      setBulkSelections,
    ] = useState<
      Record<
        string,
        FinalReviewStatus
      >
    >({});


    const [
      bulkSaving,
      setBulkSaving,
    ] = useState(
      false
    );


    // ==================================================
    // FETCH
    // ==================================================

    const fetchReviewData =
      useCallback(
        async (
          showLoader =
            true
        ) => {
          try {
            if (
              showLoader
            ) {
              setLoading(
                true
              );
            }

            setError(
              null
            );

            const [
              studentsResult,
              submissionsResult,
              statsResult,
            ] =
              await Promise.allSettled(
                [
                  api.get(
                    "/students",
                    {
                      params: {
                        sessionId,

                        classId,

                        sectionId,

                        status:
                          "ACTIVE",

                        page:
                          1,

                        limit:
                          100,
                      },
                    }
                  ),

                  api.get(
                    `/homework-submissions/homework/${homeworkId}`,
                    {
                      params: {
                        page:
                          1,

                        limit:
                          100,
                      },
                    }
                  ),

                  api.get(
                    `/homework-submissions/homework/${homeworkId}/stats`
                  ),
                ]
              );


            // ============================================
            // STUDENTS
            // ============================================

            if (
              studentsResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  studentsResult.value
                );

              const list =
                extractArray(
                  data,
                  [
                    "students",
                    "data",
                  ]
                );

              setStudents(
                list
              );
            } else {
              throw (
                studentsResult.reason
              );
            }


            // ============================================
            // SUBMISSIONS
            // ============================================

            if (
              submissionsResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  submissionsResult.value
                );

              const list =
                extractArray(
                  data,
                  [
                    "submissions",
                    "data",
                  ]
                );

              setSubmissions(
                list
              );
            } else {
              throw (
                submissionsResult.reason
              );
            }


            // ============================================
            // STATS
            // ============================================

            if (
              statsResult.status ===
              "fulfilled"
            ) {
              const data =
                getApiData(
                  statsResult.value
                );

              const value =
                data?.stats ??
                data;

              if (value) {
                setStats({
                  totalStudents:
                    Number(
                      value.totalStudents ??
                        0
                    ),

                  totalRecords:
                    Number(
                      value.totalRecords ??
                        0
                    ),

                  onlineSubmitted:
                    Number(
                      value.onlineSubmitted ??
                        0
                    ),

                  offlineChecked:
                    Number(
                      value.offlineChecked ??
                        0
                    ),

                  pendingStudents:
                    Number(
                      value.pendingStudents ??
                        0
                    ),

                  onTimeSubmitted:
                    Number(
                      value.onTimeSubmitted ??
                        0
                    ),

                  lateSubmitted:
                    Number(
                      value.lateSubmitted ??
                        0
                    ),

                  completed:
                    Number(
                      value.completed ??
                        0
                    ),

                  incomplete:
                    Number(
                      value.incomplete ??
                        0
                    ),

                  redoRequired:
                    Number(
                      value.redoRequired ??
                        0
                    ),

                  pendingReview:
                    Number(
                      value.pendingReview ??
                        0
                    ),

                  legacyReviewed:
                    Number(
                      value.legacyReviewed ??
                        0
                    ),

                  ...(value.homeworkId
                    ? {
                        homeworkId:
                          String(
                            value.homeworkId
                          ),
                      }
                    : {}),
                });
              }
            }
          } catch (
            err: any
          ) {
            console.log(
              "TEACHER HOMEWORK REVIEW ERROR:",
              err?.response
                ?.data ??
                err?.message
            );

            setError(
              err?.response
                ?.data
                ?.message ??
                "Homework students load nahi ho sake."
            );
          } finally {
            if (
              showLoader
            ) {
              setLoading(
                false
              );
            }
          }
        },
        [
          homeworkId,
          sessionId,
          classId,
          sectionId,
        ]
      );


    useEffect(() => {
      fetchReviewData();
    }, [
      fetchReviewData,
    ]);


    // ==================================================
    // REFRESH
    // ==================================================

    const handleRefresh =
      async () => {
        try {
          setRefreshing(
            true
          );

          await fetchReviewData(
            false
          );
        } finally {
          setRefreshing(
            false
          );
        }
      };


    // ==================================================
    // MERGE STUDENTS + SUBMISSIONS
    // ==================================================

    const rows =
      useMemo<
        StudentReviewRow[]
      >(() => {
        const submissionMap =
          new Map<
            string,
            HomeworkSubmission
          >();

        submissions.forEach(
          (
            submission
          ) => {
            const studentId =
              getId(
                submission.studentId
              );

            if (studentId) {
              submissionMap.set(
                studentId,
                submission
              );
            }
          }
        );

        return students
          .map(
            (
              student
            ) => {
              const studentId =
                getStudentId(
                  student
                );

              return {
                student,

                studentId,

                submission:
                  submissionMap.get(
                    studentId
                  ) ??
                  null,
              };
            }
          )
          .filter(
            (
              row
            ) =>
              Boolean(
                row.studentId
              )
          )
          .sort(
            (
              a,
              b
            ) => {
              const rollA =
                Number(
                  a.student
                    .rollNumber
                ) || 999999;

              const rollB =
                Number(
                  b.student
                    .rollNumber
                ) || 999999;

              return (
                rollA -
                rollB
              );
            }
          );
      }, [
        students,
        submissions,
      ]);


    // ==================================================
    // FILTER
    // ==================================================

    const filteredRows =
      useMemo(() => {
        switch (
          filter
        ) {
          case "PENDING":
            return rows.filter(
              (
                row
              ) =>
                !row.submission ||
                row.submission
                  .reviewStatus ===
                  "PENDING"
            );

          case "COMPLETED":
            return rows.filter(
              (
                row
              ) =>
                row.submission
                  ?.reviewStatus ===
                "COMPLETED"
            );

          case "INCOMPLETE":
            return rows.filter(
              (
                row
              ) =>
                row.submission
                  ?.reviewStatus ===
                "INCOMPLETE"
            );

          case "REDO_REQUIRED":
            return rows.filter(
              (
                row
              ) =>
                row.submission
                  ?.reviewStatus ===
                "REDO_REQUIRED"
            );

          case "ONLINE":
            return rows.filter(
              (
                row
              ) =>
                row.submission
                  ?.submissionMode ===
                "ONLINE"
            );

          case "OFFLINE":
            return rows.filter(
              (
                row
              ) =>
                row.submission
                  ?.submissionMode ===
                "OFFLINE"
            );

          default:
            return rows;
        }
      }, [
        rows,
        filter,
      ]);


    // ==================================================
    // OPEN REVIEW
    // ==================================================

    const openReview =
      (
        row:
          StudentReviewRow
      ) => {
        setSelectedRow(
          row
        );

        const existingStatus =
          row.submission
            ?.reviewStatus;

        if (
          existingStatus ===
            "COMPLETED" ||
          existingStatus ===
            "INCOMPLETE" ||
          existingStatus ===
            "REDO_REQUIRED"
        ) {
          setSelectedReviewStatus(
            existingStatus
          );
        } else {
          setSelectedReviewStatus(
            null
          );
        }

        setRemarks(
          row.submission
            ?.remarks ??
            ""
        );

        setMarks(
          row.submission
            ?.marks !==
          undefined
            ? String(
                row.submission
                  .marks
              )
            : ""
        );
      };


    // ==================================================
    // CLOSE
    // ==================================================

    const closeReview =
      () => {
        if (
          reviewing
        ) {
          return;
        }

        setSelectedRow(
          null
        );

        setSelectedReviewStatus(
          null
        );

        setRemarks("");

        setMarks("");
      };


    // ==================================================
    // SAVE SINGLE REVIEW
    // ==================================================

    const handleReview =
      async () => {
        if (
          !selectedRow
        ) {
          return;
        }

        if (
          !selectedReviewStatus
        ) {
          Alert.alert(
            "Select Status",
            "Completed, Incomplete ya Redo Required select karein."
          );

          return;
        }

        const trimmedMarks =
          marks.trim();

        let marksValue:
          number | undefined;

        if (
          trimmedMarks
        ) {
          marksValue =
            Number(
              trimmedMarks
            );

          if (
            Number.isNaN(
              marksValue
            ) ||
            marksValue < 0
          ) {
            Alert.alert(
              "Invalid Marks",
              "Marks valid non-negative number hona chahiye."
            );

            return;
          }
        }

        try {
          setReviewing(
            true
          );

          const payload: {
            reviewStatus:
              FinalReviewStatus;

            remarks?: string;

            marks?: number;
          } = {
            reviewStatus:
              selectedReviewStatus,
          };

          if (
            remarks.trim()
          ) {
            payload.remarks =
              remarks.trim();
          }

          if (
            marksValue !==
            undefined
          ) {
            payload.marks =
              marksValue;
          }


          const submissionId =
            selectedRow
              .submission
              ? (
                  selectedRow
                    .submission
                    ._id ??
                  selectedRow
                    .submission
                    .id ??
                  ""
                )
              : "";


          // Existing ONLINE/OFFLINE record
          if (
            submissionId
          ) {
            await api.patch(
              `/homework-submissions/${submissionId}/review`,
              payload
            );
          } else {
            // No app submission:
            // create teacher verified OFFLINE record.

            await api.patch(
              `/homework-submissions/homework/${homeworkId}/offline-review`,
              {
                studentId:
                  selectedRow
                    .studentId,

                ...payload,
              }
            );
          }

          Alert.alert(
            "Saved",
            "Homework review save ho gaya."
          );

          closeReview();

          await fetchReviewData(
            false
          );
        } catch (
          err: any
        ) {
          console.log(
            "REVIEW HOMEWORK ERROR:",
            err?.response
              ?.data ??
              err?.message
          );

          Alert.alert(
            "Review Failed",
            err?.response
              ?.data
              ?.message ??
              "Homework review save nahi ho saka."
          );
        } finally {
          setReviewing(
            false
          );
        }
      };


    // ==================================================
    // BULK STATUS
    // ==================================================

    const setBulkStatus =
      (
        studentId: string,
        status:
          FinalReviewStatus
      ) => {
        setBulkSelections(
          (
            previous
          ) => ({
            ...previous,

            [studentId]:
              status,
          })
        );
      };


    const clearBulkStatus =
      (
        studentId: string
      ) => {
        setBulkSelections(
          (
            previous
          ) => {
            const next = {
              ...previous,
            };

            delete next[
              studentId
            ];

            return next;
          }
        );
      };


    const bulkCount =
      Object.keys(
        bulkSelections
      ).length;


    // ==================================================
    // SELECT ALL / UNSELECT ALL
    // ==================================================

    const visibleStudentIds =
      useMemo(
        () =>
          filteredRows
            .map(
              (row) =>
                row.studentId
            )
            .filter(Boolean),
        [filteredRows]
      );


    const selectedVisibleCount =
      useMemo(
        () =>
          visibleStudentIds.filter(
            (studentId) =>
              Boolean(
                bulkSelections[
                  studentId
                ]
              )
          ).length,
        [
          visibleStudentIds,
          bulkSelections,
        ]
      );


    const areAllVisibleSelected =
      visibleStudentIds.length >
        0 &&
      selectedVisibleCount ===
        visibleStudentIds.length;


    const hasSomeVisibleSelected =
      selectedVisibleCount >
        0 &&
      !areAllVisibleSelected;


    const handleSelectAllVisible =
      () => {
        setBulkSelections(
          (previous) => {
            const next = {
              ...previous,
            };

            if (
              areAllVisibleSelected
            ) {
              visibleStudentIds.forEach(
                (studentId) => {
                  delete next[
                    studentId
                  ];
                }
              );

              return next;
            }

            visibleStudentIds.forEach(
              (studentId) => {
                if (
                  !next[
                    studentId
                  ]
                ) {
                  next[
                    studentId
                  ] =
                    "COMPLETED";
                }
              }
            );

            return next;
          }
        );
      };


    const clearAllSelections =
      () => {
        setBulkSelections(
          {}
        );
      };


    // ==================================================
    // BULK SAVE
    // ==================================================

    const handleBulkSave =
      async () => {
        if (
          bulkCount === 0
        ) {
          Alert.alert(
            "No Selection",
            "Bulk save ke liye kam se kam ek student select karein."
          );

          return;
        }

        const studentsPayload:
          BulkSelection[] =
          Object.entries(
            bulkSelections
          ).map(
            ([
              studentId,
              reviewStatus,
            ]) => ({
              studentId,

              reviewStatus,
            })
          );

        try {
          setBulkSaving(
            true
          );

          await api.patch(
            `/homework-submissions/homework/${homeworkId}/bulk-review`,
            {
              students:
                studentsPayload,
            }
          );

          setBulkSelections(
            {}
          );

          Alert.alert(
            "Saved",
            `${studentsPayload.length} student homework review save ho gaye.`
          );

          await fetchReviewData(
            false
          );
        } catch (
          err: any
        ) {
          console.log(
            "BULK HOMEWORK REVIEW ERROR:",
            err?.response
              ?.data ??
              err?.message
          );

          Alert.alert(
            "Bulk Review Failed",
            err?.response
              ?.data
              ?.message ??
              "Bulk review save nahi ho saka."
          );
        } finally {
          setBulkSaving(
            false
          );
        }
      };


    // ==================================================
    // ATTACHMENT
    // ==================================================

    const openAttachment =
      async (
        fileUrl?: string
      ) => {
        if (!fileUrl) {
          return;
        }

        try {
          const supported =
            await Linking.canOpenURL(
              fileUrl
            );

          if (!supported) {
            Alert.alert(
              "File",
              "Ye attachment open nahi ho raha."
            );

            return;
          }

          await Linking.openURL(
            fileUrl
          );
        } catch {
          Alert.alert(
            "File Error",
            "Attachment open nahi ho saka."
          );
        }
      };


    // ==================================================
    // LOADING
    // ==================================================

    if (
      loading
    ) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">

            <Ionicons
              name="documents-outline"
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
            Loading students...
          </Text>

        </SafeAreaView>
      );
    }


    // ==================================================
    // UI
    // ==================================================

    return (
      <SafeAreaView
        edges={[
          "top",
          "left",
          "right",
        ]}
        className="flex-1 bg-[#F7F7FB]"
      >

        {/* HEADER */}

        <View className="flex-row items-center bg-[#4355D8] px-5 pb-6 pt-4">

          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15"
          >

            <Ionicons
              name="arrow-back"
              size={22}
              color="#FFFFFF"
            />

          </Pressable>

          <View className="ml-4 flex-1">

            <Text className="text-xl font-extrabold text-white">
              Homework Review
            </Text>

            <Text
              numberOfLines={1}
              className="mt-1 text-xs text-white/70"
            >
              {homeworkTitle ??
                "Review student homework"}
            </Text>

          </View>

        </View>


        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="pb-36"
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

          {/* STATS */}

          {stats ? (
            <View className="px-5 pt-5">

              <View className="flex-row gap-2">

                <View className="flex-1 rounded-2xl bg-white p-3">
                  <Text className="text-[9px] font-extrabold text-[#606F88]">
                    STUDENTS
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#15213B]">
                    {stats.totalStudents}
                  </Text>
                </View>


                <View className="flex-1 rounded-2xl bg-[#E7F7F1] p-3">
                  <Text className="text-[9px] font-extrabold text-[#2BAA7B]">
                    ONLINE
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#2BAA7B]">
                    {stats.onlineSubmitted}
                  </Text>
                </View>


                <View className="flex-1 rounded-2xl bg-[#EEF0FF] p-3">
                  <Text className="text-[9px] font-extrabold text-[#4355D8]">
                    OFFLINE
                  </Text>

                  <Text className="mt-1 text-xl font-extrabold text-[#4355D8]">
                    {stats.offlineChecked}
                  </Text>
                </View>

              </View>


              <View className="mt-2 flex-row gap-2">

                <View className="flex-1 rounded-2xl bg-[#E7F7F1] p-3">
                  <Text className="text-[9px] font-extrabold text-[#2BAA7B]">
                    DONE
                  </Text>

                  <Text className="mt-1 text-lg font-extrabold text-[#2BAA7B]">
                    {stats.completed}
                  </Text>
                </View>


                <View className="flex-1 rounded-2xl bg-[#FDECEE] p-3">
                  <Text className="text-[9px] font-extrabold text-[#DC4C5A]">
                    INCOMPLETE
                  </Text>

                  <Text className="mt-1 text-lg font-extrabold text-[#DC4C5A]">
                    {stats.incomplete}
                  </Text>
                </View>


                <View className="flex-1 rounded-2xl bg-[#FFF2DE] p-3">
                  <Text className="text-[9px] font-extrabold text-[#E59A2F]">
                    REDO
                  </Text>

                  <Text className="mt-1 text-lg font-extrabold text-[#E59A2F]">
                    {stats.redoRequired}
                  </Text>
                </View>

              </View>

            </View>
          ) : null}


          {/* FILTERS */}

          <View className="pt-5">

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerClassName="px-5"
            >

              {[
                {
                  key:
                    "ALL",
                  label:
                    "All",
                },
                {
                  key:
                    "PENDING",
                  label:
                    "Pending",
                },
                {
                  key:
                    "COMPLETED",
                  label:
                    "Completed",
                },
                {
                  key:
                    "INCOMPLETE",
                  label:
                    "Incomplete",
                },
                {
                  key:
                    "REDO_REQUIRED",
                  label:
                    "Redo",
                },
                {
                  key:
                    "ONLINE",
                  label:
                    "Online",
                },
                {
                  key:
                    "OFFLINE",
                  label:
                    "Offline",
                },
              ].map(
                (
                  item
                ) => {
                  const active =
                    filter ===
                    item.key;

                  return (
                    <Pressable
                      key={
                        item.key
                      }
                      onPress={() =>
                        setFilter(
                          item.key as
                            FilterType
                        )
                      }
                      className={`mr-2 rounded-full border px-4 py-2.5 ${
                        active
                          ? "border-[#4355D8] bg-[#4355D8]"
                          : "border-[#E5E8F0] bg-white"
                      }`}
                    >

                      <Text
                        className={`text-xs font-bold ${
                          active
                            ? "text-white"
                            : "text-[#606F88]"
                        }`}
                      >
                        {item.label}
                      </Text>

                    </Pressable>
                  );
                }
              )}

            </ScrollView>

          </View>


          {/* ERROR */}

          {error ? (
            <View className="px-5 pt-5">

              <View className="rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

                <Text className="text-xs font-semibold text-[#DC4C5A]">
                  {error}
                </Text>

                <Pressable
                  onPress={() =>
                    fetchReviewData()
                  }
                  className="mt-3 self-start rounded-xl bg-[#DC4C5A] px-4 py-2.5"
                >

                  <Text className="text-xs font-bold text-white">
                    Retry
                  </Text>

                </Pressable>

              </View>

            </View>
          ) : null}


          {/* TITLE + SELECT ALL */}

          <View className="px-5 pb-3 pt-6">

            <View className="flex-row items-center">

              <View className="flex-1">

                <Text className="text-lg font-extrabold text-[#15213B]">
                  Students
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  {filteredRows.length} student(s)
                  {selectedVisibleCount > 0
                    ? ` • ${selectedVisibleCount} selected`
                    : ""}
                </Text>

              </View>


              {filteredRows.length >
              0 ? (
                <Pressable
                  onPress={
                    handleSelectAllVisible
                  }
                  className={`flex-row items-center rounded-2xl border px-3 py-2.5 ${
                    areAllVisibleSelected
                      ? "border-[#4355D8] bg-[#EEF0FF]"
                      : hasSomeVisibleSelected
                        ? "border-[#4355D8] bg-white"
                        : "border-[#E5E8F0] bg-white"
                  }`}
                >

                  <View
                    className={`h-5 w-5 items-center justify-center rounded-md border ${
                      areAllVisibleSelected
                        ? "border-[#4355D8] bg-[#4355D8]"
                        : hasSomeVisibleSelected
                          ? "border-[#4355D8] bg-[#EEF0FF]"
                          : "border-[#C8CEDA] bg-white"
                    }`}
                  >

                    {areAllVisibleSelected ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#FFFFFF"
                      />
                    ) : hasSomeVisibleSelected ? (
                      <Ionicons
                        name="remove"
                        size={14}
                        color="#4355D8"
                      />
                    ) : null}

                  </View>

                  <Text
                    className={`ml-2 text-xs font-extrabold ${
                      areAllVisibleSelected ||
                      hasSomeVisibleSelected
                        ? "text-[#4355D8]"
                        : "text-[#606F88]"
                    }`}
                  >
                    {areAllVisibleSelected
                      ? "Unselect All"
                      : "Select All"}
                  </Text>

                </Pressable>
              ) : null}

            </View>


            {bulkCount >
            0 ? (
              <View className="mt-3 flex-row items-center rounded-2xl bg-[#EEF0FF] px-4 py-3">

                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#4355D8"
                />

                <Text className="ml-2 flex-1 text-xs font-bold text-[#4355D8]">
                  {bulkCount} student
                  {bulkCount > 1
                    ? "s"
                    : ""} selected
                </Text>

                <Pressable
                  onPress={
                    clearAllSelections
                  }
                >
                  <Text className="text-xs font-extrabold text-[#DC4C5A]">
                    Clear
                  </Text>
                </Pressable>

              </View>
            ) : null}

          </View>


          {/* STUDENTS */}

          <View className="px-5">

            {filteredRows.map(
              (
                row
              ) => {
                const {
                  student,
                  studentId,
                  submission,
                } = row;

                const studentName =
                  getStudentName(
                    student
                  );

                const reviewUI =
                  getReviewUI(
                    submission
                      ?.reviewStatus
                  );

                const selectedBulkStatus =
                  bulkSelections[
                    studentId
                  ];

                const mode =
                  submission
                    ?.submissionMode ??
                  (
                    submission
                      ?.submittedAt
                      ? "ONLINE"
                      : null
                  );

                return (
                  <View
                    key={
                      studentId
                    }
                    className={`mb-4 rounded-3xl border bg-white p-5 ${
                      selectedBulkStatus
                        ? "border-[#4355D8]"
                        : "border-[#E5E8F0]"
                    }`}
                  >

                    {/* STUDENT */}

                    <View className="flex-row items-start">

                      <Pressable
                        onPress={() => {
                          if (
                            selectedBulkStatus
                          ) {
                            clearBulkStatus(
                              studentId
                            );
                          } else {
                            setBulkStatus(
                              studentId,
                              "COMPLETED"
                            );
                          }
                        }}
                        hitSlop={8}
                        className={`mr-3 mt-1 h-6 w-6 items-center justify-center rounded-lg border ${
                          selectedBulkStatus
                            ? "border-[#4355D8] bg-[#4355D8]"
                            : "border-[#C8CEDA] bg-white"
                        }`}
                      >

                        {selectedBulkStatus ? (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#FFFFFF"
                          />
                        ) : null}

                      </Pressable>

                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                        <Text className="text-base font-extrabold text-[#4355D8]">
                          {studentName
                            .charAt(
                              0
                            )
                            .toUpperCase()}
                        </Text>
                      </View>


                      <View className="ml-3 flex-1">

                        <Text className="text-sm font-extrabold text-[#15213B]">
                          {studentName}
                        </Text>

                        <Text className="mt-1 text-[10px] text-[#606F88]">
                          Roll No:{" "}
                          {student.rollNumber ??
                            "-"}
                          {" • "}
                          {student.admissionNumber ??
                            "No admission number"}
                        </Text>

                      </View>


                      <View className={`rounded-full px-2.5 py-1.5 ${reviewUI.container}`}>

                        <Text className={`text-[9px] font-extrabold ${reviewUI.text}`}>
                          {reviewUI.label}
                        </Text>

                      </View>

                    </View>


                    {/* MODE */}

                    <View className="mt-4 flex-row items-center">

                      {mode ? (
                        <View className={`rounded-xl px-3 py-2 ${
                          mode ===
                          "ONLINE"
                            ? "bg-[#EEF0FF]"
                            : "bg-[#F5ECFF]"
                        }`}>

                          <Text className={`text-[9px] font-extrabold ${
                            mode ===
                            "ONLINE"
                              ? "text-[#4355D8]"
                              : "text-[#8B5CF6]"
                          }`}>
                            {mode}
                          </Text>

                        </View>
                      ) : (
                        <View className="rounded-xl bg-[#F4F5FA] px-3 py-2">

                          <Text className="text-[9px] font-extrabold text-[#606F88]">
                            NO ONLINE SUBMISSION
                          </Text>

                        </View>
                      )}

                      {submission
                        ?.submissionStatus ===
                      "LATE" ? (
                        <View className="ml-2 rounded-xl bg-[#FDECEE] px-3 py-2">

                          <Text className="text-[9px] font-extrabold text-[#DC4C5A]">
                            LATE
                          </Text>

                        </View>
                      ) : null}

                    </View>


                    {/* ANSWER */}

                    {submission
                      ?.submissionText ? (
                      <View className="mt-4 rounded-2xl bg-[#F7F7FB] p-4">

                        <Text className="text-[9px] font-extrabold text-[#9AA4B5]">
                          STUDENT ANSWER
                        </Text>

                        <Text className="mt-2 text-xs leading-5 text-[#15213B]">
                          {submission.submissionText}
                        </Text>

                      </View>
                    ) : null}


                    {/* ATTACHMENT */}

                    {submission
                      ?.attachment
                      ?.fileUrl ? (
                      <Pressable
                        onPress={() =>
                          openAttachment(
                            submission
                              .attachment
                              ?.fileUrl
                          )
                        }
                        className="mt-3 flex-row items-center rounded-2xl border border-[#E5E8F0] p-3"
                      >

                        <Ionicons
                          name="attach-outline"
                          size={20}
                          color="#4355D8"
                        />

                        <View className="ml-3 flex-1">

                          <Text
                            numberOfLines={
                              1
                            }
                            className="text-xs font-extrabold text-[#15213B]"
                          >
                            {submission
                              .attachment
                              ?.fileName ??
                              "Attachment"}
                          </Text>

                          <Text className="mt-1 text-[9px] text-[#606F88]">
                            {formatFileSize(
                              submission
                                .attachment
                                ?.fileSize
                            ) ||
                              "Tap to open"}
                          </Text>

                        </View>

                      </Pressable>
                    ) : null}


                    {/* EXISTING REVIEW */}

                    {submission &&
                    submission.reviewStatus !==
                      "PENDING" ? (
                      <View className={`mt-4 rounded-2xl p-4 ${reviewUI.container}`}>

                        <View className="flex-row items-center">

                          <Ionicons
                            name={
                              reviewUI.icon
                            }
                            size={18}
                            color={
                              reviewUI.iconColor
                            }
                          />

                          <Text className={`ml-2 text-xs font-extrabold ${reviewUI.text}`}>
                            {reviewUI.label}
                          </Text>

                        </View>

                        {submission.marks !==
                        undefined ? (
                          <Text className="mt-2 text-xs font-bold text-[#15213B]">
                            Marks: {submission.marks}
                          </Text>
                        ) : null}

                        {submission.remarks ? (
                          <Text className="mt-2 text-xs leading-5 text-[#606F88]">
                            {submission.remarks}
                          </Text>
                        ) : null}

                        {submission.reviewedAt ? (
                          <Text className="mt-2 text-[9px] text-[#606F88]">
                            Reviewed:{" "}
                            {formatDateTime(
                              submission.reviewedAt
                            )}
                          </Text>
                        ) : null}

                      </View>
                    ) : null}


                    {/* BULK QUICK MARK */}

                    <View className="mt-4">

                      <Text className="mb-2 text-[9px] font-extrabold text-[#9AA4B5]">
                        QUICK MARK
                      </Text>


                      <View className="flex-row gap-2">

                        <Pressable
                          onPress={() =>
                            selectedBulkStatus ===
                            "COMPLETED"
                              ? clearBulkStatus(
                                  studentId
                                )
                              : setBulkStatus(
                                  studentId,
                                  "COMPLETED"
                                )
                          }
                          className={`flex-1 items-center rounded-xl border px-2 py-3 ${
                            selectedBulkStatus ===
                            "COMPLETED"
                              ? "border-[#2BAA7B] bg-[#E7F7F1]"
                              : "border-[#E5E8F0]"
                          }`}
                        >

                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#2BAA7B"
                          />

                          <Text className="mt-1 text-[8px] font-extrabold text-[#2BAA7B]">
                            DONE
                          </Text>

                        </Pressable>


                        <Pressable
                          onPress={() =>
                            selectedBulkStatus ===
                            "INCOMPLETE"
                              ? clearBulkStatus(
                                  studentId
                                )
                              : setBulkStatus(
                                  studentId,
                                  "INCOMPLETE"
                                )
                          }
                          className={`flex-1 items-center rounded-xl border px-2 py-3 ${
                            selectedBulkStatus ===
                            "INCOMPLETE"
                              ? "border-[#DC4C5A] bg-[#FDECEE]"
                              : "border-[#E5E8F0]"
                          }`}
                        >

                          <Ionicons
                            name="close"
                            size={16}
                            color="#DC4C5A"
                          />

                          <Text className="mt-1 text-[8px] font-extrabold text-[#DC4C5A]">
                            INCOMPLETE
                          </Text>

                        </Pressable>


                        <Pressable
                          onPress={() =>
                            selectedBulkStatus ===
                            "REDO_REQUIRED"
                              ? clearBulkStatus(
                                  studentId
                                )
                              : setBulkStatus(
                                  studentId,
                                  "REDO_REQUIRED"
                                )
                          }
                          className={`flex-1 items-center rounded-xl border px-2 py-3 ${
                            selectedBulkStatus ===
                            "REDO_REQUIRED"
                              ? "border-[#E59A2F] bg-[#FFF2DE]"
                              : "border-[#E5E8F0]"
                          }`}
                        >

                          <Ionicons
                            name="refresh"
                            size={16}
                            color="#E59A2F"
                          />

                          <Text className="mt-1 text-[8px] font-extrabold text-[#E59A2F]">
                            REDO
                          </Text>

                        </Pressable>

                      </View>

                    </View>


                    {/* DETAIL REVIEW */}

                    <Pressable
                      onPress={() =>
                        openReview(
                          row
                        )
                      }
                      className="mt-3 flex-row items-center justify-center rounded-2xl bg-[#EEF0FF] py-3.5"
                    >

                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#4355D8"
                      />

                      <Text className="ml-2 text-xs font-extrabold text-[#4355D8]">
                        Review with Marks / Remarks
                      </Text>

                    </Pressable>

                  </View>
                );
              }
            )}

          </View>

        </ScrollView>


        {/* BULK SAVE BAR */}

        {bulkCount >
        0 ? (
          <View className="absolute bottom-0 left-0 right-0 border-t border-[#E5E8F0] bg-white px-5 pb-5 pt-4">

            <View className="flex-row items-center">

              <View className="flex-1">

                <Text className="text-sm font-extrabold text-[#15213B]">
                  {bulkCount}{" "}
                  {bulkCount === 1
                    ? "student"
                    : "students"}{" "}
                  selected
                </Text>

                <Text className="mt-1 text-[10px] text-[#606F88]">
                  {bulkCount === 1
                    ? "Save selected homework review"
                    : `Save ${bulkCount} homework reviews together`}
                </Text>

              </View>


              <Pressable
                disabled={
                  bulkSaving
                }
                onPress={
                  handleBulkSave
                }
                className={`flex-row items-center rounded-2xl px-5 py-3.5 ${
                  bulkSaving
                    ? "bg-[#9BA4E8]"
                    : "bg-[#4355D8]"
                }`}
              >

                {bulkSaving ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Ionicons
                    name="save-outline"
                    size={18}
                    color="#FFFFFF"
                  />
                )}

                <Text className="ml-2 text-xs font-extrabold text-white">
                  {bulkSaving
                    ? "Saving..."
                    : bulkCount === 1
                      ? "Save"
                      : "Save All"}
                </Text>

              </Pressable>

            </View>

          </View>
        ) : null}


        {/* SINGLE REVIEW MODAL */}

        <Modal
          visible={
            selectedRow !==
            null
          }
          transparent
          animationType="slide"
          onRequestClose={
            closeReview
          }
        >

          <View className="flex-1 justify-end bg-black/40">

            <View className="max-h-[90%] rounded-t-[32px] bg-white">

              <View className="flex-row items-center border-b border-[#EEF0F3] px-5 py-5">

                <View className="flex-1">

                  <Text className="text-lg font-extrabold text-[#15213B]">
                    Review Homework
                  </Text>

                  <Text className="mt-1 text-xs text-[#606F88]">
                    {getStudentName(
                      selectedRow
                        ?.student
                    )}
                  </Text>

                </View>


                <Pressable
                  disabled={
                    reviewing
                  }
                  onPress={
                    closeReview
                  }
                  className="h-10 w-10 items-center justify-center rounded-xl bg-[#F4F5FA]"
                >

                  <Ionicons
                    name="close"
                    size={20}
                    color="#15213B"
                  />

                </Pressable>

              </View>


              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={
                  false
                }
                contentContainerClassName="px-5 pb-8 pt-5"
              >

                {/* STATUS */}

                <Text className="text-sm font-extrabold text-[#15213B]">
                  Homework Status
                </Text>

                <Text className="mt-1 text-[10px] text-[#606F88]">
                  Teacher verification
                </Text>


                <View className="mt-3 gap-2">

                  <Pressable
                    onPress={() =>
                      setSelectedReviewStatus(
                        "COMPLETED"
                      )
                    }
                    className={`flex-row items-center rounded-2xl border p-4 ${
                      selectedReviewStatus ===
                      "COMPLETED"
                        ? "border-[#2BAA7B] bg-[#E7F7F1]"
                        : "border-[#E5E8F0]"
                    }`}
                  >

                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color="#2BAA7B"
                    />

                    <Text className="ml-3 text-sm font-extrabold text-[#2BAA7B]">
                      Completed
                    </Text>

                  </Pressable>


                  <Pressable
                    onPress={() =>
                      setSelectedReviewStatus(
                        "INCOMPLETE"
                      )
                    }
                    className={`flex-row items-center rounded-2xl border p-4 ${
                      selectedReviewStatus ===
                      "INCOMPLETE"
                        ? "border-[#DC4C5A] bg-[#FDECEE]"
                        : "border-[#E5E8F0]"
                    }`}
                  >

                    <Ionicons
                      name="close-circle"
                      size={22}
                      color="#DC4C5A"
                    />

                    <Text className="ml-3 text-sm font-extrabold text-[#DC4C5A]">
                      Incomplete
                    </Text>

                  </Pressable>


                  <Pressable
                    onPress={() =>
                      setSelectedReviewStatus(
                        "REDO_REQUIRED"
                      )
                    }
                    className={`flex-row items-center rounded-2xl border p-4 ${
                      selectedReviewStatus ===
                      "REDO_REQUIRED"
                        ? "border-[#E59A2F] bg-[#FFF2DE]"
                        : "border-[#E5E8F0]"
                    }`}
                  >

                    <Ionicons
                      name="refresh-circle"
                      size={22}
                      color="#E59A2F"
                    />

                    <Text className="ml-3 text-sm font-extrabold text-[#E59A2F]">
                      Redo Required
                    </Text>

                  </Pressable>

                </View>


                {/* MARKS */}

                <View className="mt-5">

                  <Text className="text-sm font-extrabold text-[#15213B]">
                    Marks
                  </Text>

                  <Text className="mt-1 text-[10px] text-[#606F88]">
                    Optional
                  </Text>

                  <TextInput
                    value={
                      marks
                    }
                    onChangeText={
                      setMarks
                    }
                    keyboardType="decimal-pad"
                    placeholder="Enter marks"
                    placeholderTextColor="#9AA4B5"
                    className="mt-3 rounded-2xl border border-[#E5E8F0] px-4 py-4 text-sm text-[#15213B]"
                  />

                </View>


                {/* REMARKS */}

                <View className="mt-5">

                  <Text className="text-sm font-extrabold text-[#15213B]">
                    Teacher Remarks
                  </Text>

                  <TextInput
                    value={
                      remarks
                    }
                    onChangeText={
                      setRemarks
                    }
                    multiline
                    textAlignVertical="top"
                    placeholder="Example: Good work. Question 4 dobara karein."
                    placeholderTextColor="#9AA4B5"
                    className="mt-3 min-h-[120px] rounded-2xl border border-[#E5E8F0] px-4 py-4 text-sm leading-5 text-[#15213B]"
                  />

                </View>


                {/* SAVE */}

                <Pressable
                  disabled={
                    reviewing
                  }
                  onPress={
                    handleReview
                  }
                  className={`mt-6 flex-row items-center justify-center rounded-2xl py-4 ${
                    reviewing
                      ? "bg-[#9BA4E8]"
                      : "bg-[#4355D8]"
                  }`}
                >

                  {reviewing ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <Ionicons
                      name="checkmark-done-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  )}

                  <Text className="ml-2 text-sm font-extrabold text-white">
                    {reviewing
                      ? "Saving..."
                      : "Save Review"}
                  </Text>

                </Pressable>

              </ScrollView>

            </View>

          </View>

        </Modal>

      </SafeAreaView>
    );
  };


export default TeacherHomeworkReviewScreen;