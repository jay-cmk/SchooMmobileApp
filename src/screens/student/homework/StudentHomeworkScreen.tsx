import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useFocusEffect,
} from "@react-navigation/native";

import api from "../../../api/axios";

import type {
  HomeworkItem,
} from "types/student.types";

import {
  extractApiData,
  extractArray,
  formatDate,
  getName,
} from "utils/studentHelpers";


type ReviewStatus =
  | "PENDING"
  | "COMPLETED"
  | "INCOMPLETE"
  | "REDO_REQUIRED"
  | "REVIEWED";


type SubmissionMode =
  | "ONLINE"
  | "OFFLINE";


type SubmissionStatus =
  | "NOT_SUBMITTED"
  | "SUBMITTED"
  | "LATE";


interface HomeworkSubmission {
  _id: string;

  homeworkId:
    | string
    | {
        _id: string;
        title?: string;
      };

  studentId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  submissionMode?: SubmissionMode;

  submissionStatus?: SubmissionStatus;

  reviewStatus?: ReviewStatus;

  remarks?: string;

  teacherRemarks?: string;

  marks?: number;

  submittedAt?: string;
}


const getId = (
  value:
    | string
    | {
        _id?: string;
        id?: string;
      }
    | null
    | undefined
) => {
  if (!value) {
    return "";
  }

  if (
    typeof value === "string"
  ) {
    return value;
  }

  return (
    value._id ??
    value.id ??
    ""
  );
};


const StudentHomeworkScreen =
  () => {
    const [
      homework,
      setHomework,
    ] = useState<
      HomeworkItem[]
    >([]);

    const [
      submissions,
      setSubmissions,
    ] = useState<
      HomeworkSubmission[]
    >([]);

    const [
      loading,
      setLoading,
    ] = useState(true);

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


    /* =========================================
       LOAD HOMEWORK + STUDENT SUBMISSIONS
    ========================================= */

    const loadHomework =
      useCallback(
        async (
          showLoader = true
        ) => {
          try {
            if (showLoader) {
              setLoading(true);
            }

            setError(null);


            const [
              homeworkResponse,
              submissionResponse,
            ] =
              await Promise.all([
                api.get(
                  "/homework/me"
                ),

                api.get(
                  "/homework-submissions/me"
                ),
              ]);


            /* =================================
               HOMEWORK
            ================================= */

            const homeworkData =
              extractApiData(
                homeworkResponse
              );

            const homeworkList =
              extractArray(
                homeworkData,
                [
                  "homework",
                  "homeworks",
                  "assignments",
                ]
              ) as HomeworkItem[];

            setHomework(
              homeworkList
            );


            /* =================================
               SUBMISSIONS
            ================================= */

            const submissionData =
              extractApiData(
                submissionResponse
              );


            console.log(
              "MY HOMEWORK SUBMISSIONS:",
              JSON.stringify(
                submissionResponse.data,
                null,
                2
              )
            );


            const submissionList =
              extractArray(
                submissionData,
                [
                  "submissions",
                  "submission",
                  "homeworkSubmissions",
                ]
              ) as HomeworkSubmission[];


            setSubmissions(
              submissionList
            );
          } catch (
            requestError: any
          ) {
            console.log(
              "STUDENT HOMEWORK ERROR:",
              requestError
                ?.response
                ?.data ??
                requestError
                  ?.message
            );

            setError(
              requestError
                ?.response
                ?.data
                ?.message ??
                "Unable to load homework."
            );
          } finally {
            if (showLoader) {
              setLoading(false);
            }

            setRefreshing(false);
          }
        },
        []
      );


    /* =========================================
       INITIAL LOAD
    ========================================= */

    useEffect(() => {
      loadHomework();
    }, [loadHomework]);


    /*
     * Teacher Done mark karne ke baad
     * Student Homework tab dobara open karega
     * to latest review status automatically
     * fetch hoga.
     */

    useFocusEffect(
      useCallback(() => {
        loadHomework(false);
      }, [loadHomework])
    );


    /* =========================================
       SUBMISSION MAP
    ========================================= */

    const submissionMap =
      useMemo(() => {
        const map =
          new Map<
            string,
            HomeworkSubmission
          >();

        submissions.forEach(
          (submission) => {
            const homeworkId =
              getId(
                submission.homeworkId
              );

            if (homeworkId) {
              map.set(
                homeworkId,
                submission
              );
            }
          }
        );

        return map;
      }, [submissions]);


    /* =========================================
       REFRESH
    ========================================= */

    const handleRefresh =
      () => {
        setRefreshing(true);

        loadHomework(false);
      };


    /* =========================================
       REVIEW STATUS UI
    ========================================= */

    const getReviewUI = (
      submission:
        | HomeworkSubmission
        | undefined
    ) => {
      if (!submission) {
        return {
          label:
            "Not Checked",
          container:
            "bg-[#F1F3F7]",
          text:
            "text-[#606F88]",
          icon:
            "time-outline" as const,
          iconColor:
            "#606F88",
        };
      }


      switch (
        submission.reviewStatus
      ) {
        case "COMPLETED":
        case "REVIEWED":
          return {
            label:
              "Done",
            container:
              "bg-[#E7F7F1]",
            text:
              "text-[#1F9D70]",
            icon:
              "checkmark-circle" as const,
            iconColor:
              "#1F9D70",
          };


        case "INCOMPLETE":
          return {
            label:
              "Incomplete",
            container:
              "bg-[#FDECEE]",
            text:
              "text-[#D84A5B]",
            icon:
              "close-circle" as const,
            iconColor:
              "#D84A5B",
          };


        case "REDO_REQUIRED":
          return {
            label:
              "Redo Required",
            container:
              "bg-[#FFF2DE]",
            text:
              "text-[#D88A20]",
            icon:
              "refresh-circle" as const,
            iconColor:
              "#D88A20",
          };


        case "PENDING":
        default:
          return {
            label:
              "Pending Review",
            container:
              "bg-[#EEF0FF]",
            text:
              "text-[#4355D8]",
            icon:
              "time-outline" as const,
            iconColor:
              "#4355D8",
          };
      }
    };


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <ActivityIndicator
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm text-[#606F88]">
            Loading homework...
          </Text>

        </SafeAreaView>
      );
    }


    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB]">

        <ScrollView
          contentContainerClassName="px-5 pb-10 pt-5"
          showsVerticalScrollIndicator={
            false
          }
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={
                handleRefresh
              }
              tintColor="#4355D8"
              colors={[
                "#4355D8",
              ]}
            />
          }
        >

          {/* HEADER */}

          <Text className="text-2xl font-extrabold text-[#15213B]">
            Homework
          </Text>

          <Text className="mb-6 mt-1 text-sm text-[#606F88]">
            Your assigned tasks
          </Text>


          {/* ERROR */}

          {error ? (
            <View className="mb-5 flex-row items-start rounded-2xl border border-[#F0C9CE] bg-[#FDF2F2] p-4">

              <Ionicons
                name="alert-circle-outline"
                size={20}
                color="#CC3D4E"
              />

              <Text className="ml-2 flex-1 text-sm text-[#CC3D4E]">
                {error}
              </Text>

            </View>
          ) : null}


          {/* EMPTY */}

          {homework.length ===
          0 ? (
            <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white px-6 py-10">

              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#EEF0FF]">

                <Ionicons
                  name="document-text-outline"
                  size={30}
                  color="#4355D8"
                />

              </View>

              <Text className="mt-4 text-base font-extrabold text-[#15213B]">
                No Homework
              </Text>

              <Text className="mt-2 text-center text-sm leading-5 text-[#606F88]">
                Homework assigned by your teachers will appear here.
              </Text>

            </View>
          ) : (
            homework.map(
              (
                item,
                index
              ) => {
                const homeworkId =
                  item._id ??
                  item.id ??
                  "";

                const submission =
                  submissionMap.get(
                    homeworkId
                  );

                const reviewUI =
                  getReviewUI(
                    submission
                  );


                return (
                  <View
                    key={
                      homeworkId ||
                      String(index)
                    }
                    className="mb-4 rounded-3xl border border-[#E5E8F0] bg-white p-4"
                  >

                    <View className="flex-row">

                      {/* ICON */}

                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                        <Ionicons
                          name="document-text-outline"
                          size={24}
                          color="#4355D8"
                        />

                      </View>


                      {/* DETAILS */}

                      <View className="ml-4 flex-1">

                        <Text className="text-base font-extrabold text-[#15213B]">
                          {item.title}
                        </Text>


                        <Text className="mt-1 text-xs text-[#606F88]">
                          {getName(
                            item.subjectId
                          ) ||
                            getName(
                              item.subject
                            ) ||
                            "Subject"}
                        </Text>


                        <View className="mt-3 flex-row items-center">

                          <Ionicons
                            name="calendar-outline"
                            size={14}
                            color="#606F88"
                          />

                          <Text className="ml-1 text-xs text-[#606F88]">
                            Due:{" "}
                            {formatDate(
                              item.dueDate
                            )}
                          </Text>

                        </View>


                        {/* TEACHER REVIEW STATUS */}

                        <View className="mt-4 flex-row items-center">

                          <View
                            className={`flex-row items-center rounded-xl px-3 py-2 ${reviewUI.container}`}
                          >

                            <Ionicons
                              name={
                                reviewUI.icon
                              }
                              size={15}
                              color={
                                reviewUI.iconColor
                              }
                            />

                            <Text
                              className={`ml-1 text-[11px] font-extrabold ${reviewUI.text}`}
                            >
                              {
                                reviewUI.label
                              }
                            </Text>

                          </View>


                          {submission
                            ?.submissionMode ? (
                            <View className="ml-2 rounded-xl bg-[#F4F5F8] px-3 py-2">

                              <Text className="text-[10px] font-bold text-[#606F88]">
                                {
                                  submission
                                    .submissionMode
                                }
                              </Text>

                            </View>
                          ) : null}

                        </View>

                      </View>

                    </View>


                    {/* TEACHER REMARK */}

                    {submission
                      ?.teacherRemarks ? (
                      <View className="mt-4 rounded-2xl bg-[#F7F7FB] p-3">

                        <Text className="text-[10px] font-bold tracking-wider text-[#606F88]">
                          TEACHER REMARK
                        </Text>

                        <Text className="mt-1 text-sm leading-5 text-[#15213B]">
                          {
                            submission
                              .teacherRemarks
                          }
                        </Text>

                      </View>
                    ) : null}

                  </View>
                );
              }
            )
          )}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default StudentHomeworkScreen;