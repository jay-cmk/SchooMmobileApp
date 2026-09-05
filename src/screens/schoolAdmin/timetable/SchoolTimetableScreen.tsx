import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  ActivityIndicator,
  Pressable,
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
  useNavigation,
} from "@react-navigation/native";

import {
  getAcademicClassesApi,
  getAcademicSectionsApi,
  getAcademicSessionsApi,
  getSchoolTimetableApi,
} from "../../../features/schoolAdmin/schoolAdmin.api";

import type {
  AcademicClass,
  AcademicSection,
  AcademicSession,
} from "types/schoolAdmin.types";


/* =====================================================
   TYPES
===================================================== */

interface SelectOption {
  id: string;
  label: string;
}


interface TimetableRecord {
  _id?: string;

  day?: string;

  dayOfWeek?: string;

  startTime?: string;

  endTime?: string;

  periodNumber?: number;

  subjectId?:
    | string
    | {
        _id: string;
        name?: string;
        code?: string;
      };

  teacherId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  classId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  sectionId?:
    | string
    | {
        _id: string;
        name?: string;
      };

  roomNumber?: string;

  room?: string;

  type?: string;

  status?: string;
}


/* =====================================================
   HELPERS
===================================================== */

const getRelationId = (
  value:
    | string
    | {
        _id: string;
      }
    | undefined
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

  return value._id;
};


const getRelationName = (
  value:
    | string
    | {
        _id: string;
        name?: string;
      }
    | undefined,
  fallback: string
): string => {
  if (
    value &&
    typeof value ===
      "object"
  ) {
    return (
      value.name ??
      fallback
    );
  }

  return fallback;
};


const getDay = (
  record: TimetableRecord
) => {
  return (
    record.day ??
    record.dayOfWeek ??
    "OTHER"
  ).toUpperCase();
};


const dayOrder: Record<
  string,
  number
> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
  OTHER: 8,
};


/* =====================================================
   SELECT FIELD
===================================================== */

interface SelectFieldProps {
  label: string;

  placeholder: string;

  value: string;

  options: SelectOption[];

  disabled?: boolean;

  onSelect: (
    value: string
  ) => void;
}


const SelectField = ({
  label,
  placeholder,
  value,
  options,
  disabled = false,
  onSelect,
}: SelectFieldProps) => {
  const [
    opened,
    setOpened,
  ] = useState(false);


  const selected =
    options.find(
      (option) =>
        option.id === value
    );


  return (
    <View className="mb-4">

      <Text className="mb-2 text-[10px] font-extrabold tracking-wider text-[#606F88]">
        {label}
      </Text>


      <Pressable
        disabled={disabled}
        onPress={() =>
          setOpened(
            (previous) =>
              !previous
          )
        }
        className={
          disabled
            ? "flex-row items-center rounded-2xl border border-[#E5E8F0] bg-[#F1F2F6] px-4 py-4"
            : "flex-row items-center rounded-2xl border border-[#E5E8F0] bg-white px-4 py-4"
        }
      >

        <Text
          numberOfLines={1}
          className={
            selected
              ? "flex-1 text-sm font-bold text-[#15213B]"
              : "flex-1 text-sm text-[#9AA3B2]"
          }
        >
          {selected?.label ??
            placeholder}
        </Text>


        <Ionicons
          name={
            opened
              ? "chevron-up"
              : "chevron-down"
          }
          size={18}
          color={
            disabled
              ? "#B5BBC5"
              : "#606F88"
          }
        />

      </Pressable>


      {opened &&
      !disabled ? (
        <View className="mt-2 overflow-hidden rounded-2xl border border-[#E5E8F0] bg-white">

          {options.length >
          0 ? (
            options.map(
              (option) => {
                const active =
                  option.id ===
                  value;

                return (
                  <Pressable
                    key={
                      option.id
                    }
                    onPress={() => {
                      onSelect(
                        option.id
                      );

                      setOpened(
                        false
                      );
                    }}
                    className={
                      active
                        ? "border-b border-[#EEF0F5] bg-[#EEF0FF] px-4 py-4"
                        : "border-b border-[#EEF0F5] px-4 py-4"
                    }
                  >

                    <View className="flex-row items-center">

                      <Text
                        className={
                          active
                            ? "flex-1 text-sm font-extrabold text-[#4355D8]"
                            : "flex-1 text-sm font-semibold text-[#15213B]"
                        }
                      >
                        {
                          option.label
                        }
                      </Text>


                      {active ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#4355D8"
                        />
                      ) : null}

                    </View>

                  </Pressable>
                );
              }
            )
          ) : (
            <View className="px-4 py-5">

              <Text className="text-center text-xs text-[#8A94A6]">
                No options available
              </Text>

            </View>
          )}

        </View>
      ) : null}

    </View>
  );
};


/* =====================================================
   PERIOD CARD
===================================================== */

interface PeriodCardProps {
  item: TimetableRecord;
}


const PeriodCard = ({
  item,
}: PeriodCardProps) => {
  const subject =
    getRelationName(
      item.subjectId,
      "Subject"
    );

  const teacher =
    getRelationName(
      item.teacherId,
      "Not assigned"
    );


  return (
    <View className="mb-3 rounded-3xl border border-[#E5E8F0] bg-white p-4">

      <View className="flex-row">

        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">

          {item.periodNumber ? (
            <>
              <Text className="text-[8px] font-bold text-[#606F88]">
                PERIOD
              </Text>

              <Text className="text-base font-extrabold text-[#4355D8]">
                {item.periodNumber}
              </Text>
            </>
          ) : (
            <Ionicons
              name="time-outline"
              size={23}
              color="#4355D8"
            />
          )}

        </View>


        <View className="ml-3 flex-1">

          <Text className="text-base font-extrabold text-[#15213B]">
            {subject}
          </Text>


          <View className="mt-1 flex-row items-center">

            <Ionicons
              name="person-outline"
              size={13}
              color="#606F88"
            />

            <Text className="ml-1.5 text-xs text-[#606F88]">
              {teacher}
            </Text>

          </View>

        </View>


        {item.status ? (
          <View className="self-start rounded-full bg-[#E7F7F1] px-3 py-1.5">

            <Text className="text-[8px] font-extrabold text-[#24976D]">
              {item.status}
            </Text>

          </View>
        ) : null}

      </View>


      {(item.startTime ||
        item.endTime ||
        item.roomNumber ||
        item.room) ? (
        <View className="mt-4 flex-row items-center border-t border-[#EEF0F5] pt-4">

          {item.startTime ||
          item.endTime ? (
            <View className="mr-5 flex-row items-center">

              <Ionicons
                name="time-outline"
                size={15}
                color="#8A94A6"
              />

              <Text className="ml-2 text-xs font-semibold text-[#606F88]">
                {item.startTime ??
                  "—"}
                {" - "}
                {item.endTime ??
                  "—"}
              </Text>

            </View>
          ) : null}


          {item.roomNumber ||
          item.room ? (
            <View className="flex-row items-center">

              <Ionicons
                name="location-outline"
                size={15}
                color="#8A94A6"
              />

              <Text className="ml-1 text-xs text-[#606F88]">
                {item.roomNumber ??
                  item.room}
              </Text>

            </View>
          ) : null}

        </View>
      ) : null}

    </View>
  );
};


/* =====================================================
   SCREEN
===================================================== */

const SchoolTimetableScreen =
  () => {
    const navigation =
      useNavigation();


    /* ===================================================
       ACADEMIC DATA
    =================================================== */

    const [
      sessions,
      setSessions,
    ] = useState<
      AcademicSession[]
    >([]);

    const [
      classes,
      setClasses,
    ] = useState<
      AcademicClass[]
    >([]);

    const [
      sections,
      setSections,
    ] = useState<
      AcademicSection[]
    >([]);


    /* ===================================================
       FILTERS
    =================================================== */

    const [
      sessionId,
      setSessionId,
    ] = useState("");

    const [
      classId,
      setClassId,
    ] = useState("");

    const [
      sectionId,
      setSectionId,
    ] = useState("");


    /* ===================================================
       TIMETABLE
    =================================================== */

    const [
      timetable,
      setTimetable,
    ] = useState<
      TimetableRecord[]
    >([]);

    const [
      dataLoaded,
      setDataLoaded,
    ] = useState(false);


    /* ===================================================
       UI STATE
    =================================================== */

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      timetableLoading,
      setTimetableLoading,
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


    /* ===================================================
       LOAD ACADEMIC DATA
    =================================================== */

    const loadAcademicData =
      useCallback(
        async (
          refresh = false
        ) => {
          try {
            if (refresh) {
              setRefreshing(true);
            } else {
              setLoading(true);
            }

            setError(null);


            const [
              sessionData,
              classData,
              sectionData,
            ] =
              await Promise.all([
                getAcademicSessionsApi(),
                getAcademicClassesApi(),
                getAcademicSectionsApi(),
              ]);


            setSessions(
              sessionData
            );

            setClasses(
              classData
            );

            setSections(
              sectionData
            );


            if (!sessionId) {
              const current =
                sessionData.find(
                  (session) =>
                    session.isCurrent ===
                    true
                ) ??
                sessionData[0];

              if (current) {
                setSessionId(
                  current._id
                );
              }
            }
          } catch (
            requestError: any
          ) {
            console.log(
              "TIMETABLE ACADEMIC DATA ERROR:",
              requestError
                ?.response?.data ??
                requestError?.message ??
                requestError
            );


            setError(
              requestError
                ?.response?.data
                ?.message ??
                "Academic data load nahi ho saka."
            );
          } finally {
            setLoading(false);
            setRefreshing(false);
          }
        },
        [sessionId]
      );


    useFocusEffect(
      useCallback(() => {
        loadAcademicData();
      }, [loadAcademicData])
    );


    /* ===================================================
       FILTER CLASSES
    =================================================== */

    const filteredClasses =
      useMemo(() => {
        if (!sessionId) {
          return [];
        }


        return classes.filter(
          (item) =>
            getRelationId(
              item.academicSessionId
            ) === sessionId
        );
      }, [
        classes,
        sessionId,
      ]);


    /* ===================================================
       FILTER SECTIONS
    =================================================== */

    const filteredSections =
      useMemo(() => {
        if (!classId) {
          return [];
        }


        return sections.filter(
          (item) => {
            const sameClass =
              getRelationId(
                item.classId
              ) === classId;


            const itemSessionId =
              getRelationId(
                item.academicSessionId
              );


            const sameSession =
              !itemSessionId ||
              itemSessionId ===
                sessionId;


            return (
              sameClass &&
              sameSession
            );
          }
        );
      }, [
        sections,
        classId,
        sessionId,
      ]);


    /* ===================================================
       OPTIONS
    =================================================== */

    const sessionOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          sessions.map(
            (session) => ({
              id: session._id,

              label:
                session.isCurrent
                  ? `${session.name} (Current)`
                  : session.name,
            })
          ),
        [sessions]
      );


    const classOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          filteredClasses.map(
            (item) => ({
              id: item._id,
              label: item.name,
            })
          ),
        [
          filteredClasses,
        ]
      );


    const sectionOptions =
      useMemo<
        SelectOption[]
      >(
        () =>
          filteredSections.map(
            (item) => ({
              id: item._id,
              label: item.name,
            })
          ),
        [
          filteredSections,
        ]
      );


    /* ===================================================
       RESET
    =================================================== */

    const resetTimetable =
      () => {
        setTimetable([]);
        setDataLoaded(false);
        setError(null);
      };


    const handleSessionChange = (
      value: string
    ) => {
      setSessionId(value);

      setClassId("");
      setSectionId("");

      resetTimetable();
    };


    const handleClassChange = (
      value: string
    ) => {
      setClassId(value);

      setSectionId("");

      resetTimetable();
    };


    const handleSectionChange = (
      value: string
    ) => {
      setSectionId(value);

      resetTimetable();
    };


    /* ===================================================
       LOAD TIMETABLE
    =================================================== */

    const loadTimetable =
      async () => {
        if (
          !sessionId ||
          !classId ||
          !sectionId
        ) {
          setError(
            "Session, class aur section select karein."
          );

          return;
        }


        try {
          setTimetableLoading(
            true
          );

          setError(null);


          const data =
            await getSchoolTimetableApi(
              {
                academicSessionId:
                  sessionId,

                classId,

                sectionId,
              }
            );


          console.log(
            "SCHOOL TIMETABLE RESPONSE:",
            data
          );


          let records:
            TimetableRecord[] =
            [];


          if (
            Array.isArray(data)
          ) {
            records =
              data as TimetableRecord[];
          } else if (
            Array.isArray(
              data?.timetable
            )
          ) {
            records =
              data.timetable;
          } else if (
            Array.isArray(
              data?.timetables
            )
          ) {
            records =
              data.timetables;
          } else if (
            Array.isArray(
              data?.records
            )
          ) {
            records =
              data.records;
          } else if (
            Array.isArray(
              data?.entries
            )
          ) {
            records =
              data.entries;
          }


          setTimetable(
            records
          );

          setDataLoaded(true);
        } catch (
          requestError: any
        ) {
          console.log(
            "SCHOOL TIMETABLE ERROR:",
            requestError
              ?.response?.data ??
              requestError?.message ??
              requestError
          );


          setTimetable([]);

          setDataLoaded(false);


          setError(
            requestError
              ?.response?.data
              ?.message ??
              "Timetable load nahi ho saka."
          );
        } finally {
          setTimetableLoading(
            false
          );
        }
      };


    /* ===================================================
       GROUP TIMETABLE BY DAY
    =================================================== */

    const groupedTimetable =
      useMemo(() => {
        const groups =
          new Map<
            string,
            TimetableRecord[]
          >();


        timetable.forEach(
          (record) => {
            const day =
              getDay(record);


            const existing =
              groups.get(day) ??
              [];


            existing.push(
              record
            );


            groups.set(
              day,
              existing
            );
          }
        );


        return Array.from(
          groups.entries()
        )
          .sort(
            ([dayA], [dayB]) =>
              (dayOrder[dayA] ??
                99) -
              (dayOrder[dayB] ??
                99)
          )
          .map(
            ([
              day,
              records,
            ]) => ({
              day,

              records:
                [...records].sort(
                  (
                    first,
                    second
                  ) => {
                    if (
                      first.periodNumber &&
                      second.periodNumber
                    ) {
                      return (
                        first.periodNumber -
                        second.periodNumber
                      );
                    }

                    return (
                      first.startTime ??
                      ""
                    ).localeCompare(
                      second.startTime ??
                        ""
                    );
                  }
                ),
            })
          );
      }, [timetable]);


    /* ===================================================
       LOADING
    =================================================== */

    if (loading) {
      return (
        <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">

          <ActivityIndicator
            size="large"
            color="#4355D8"
          />

          <Text className="mt-3 text-sm font-semibold text-[#606F88]">
            Loading timetable...
          </Text>

        </SafeAreaView>
      );
    }


    /* ===================================================
       UI
    =================================================== */

    return (
      <SafeAreaView className="flex-1 bg-[#F7F7FB]">

        {/* HEADER */}

        <View className="flex-row items-center px-5 py-4">

          <Pressable
            onPress={() =>
              navigation.goBack()
            }
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white"
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#15213B"
            />
          </Pressable>


          <View className="ml-4 flex-1">

            <Text className="text-xl font-extrabold text-[#15213B]">
              Timetable
            </Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              View class timetable
            </Text>

          </View>

        </View>


        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerClassName="px-5 pb-12"
          refreshControl={
            <RefreshControl
              refreshing={
                refreshing
              }
              onRefresh={() =>
                loadAcademicData(
                  true
                )
              }
              colors={[
                "#4355D8",
              ]}
              tintColor="#4355D8"
            />
          }
        >

          {/* FILTER CARD */}

          <View className="rounded-3xl border border-[#E5E8F0] bg-white p-5">

            <View className="mb-5 flex-row items-center">

              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF0FF]">

                <Ionicons
                  name="calendar-outline"
                  size={21}
                  color="#4355D8"
                />

              </View>


              <View className="ml-3">

                <Text className="text-base font-extrabold text-[#15213B]">
                  Select Class
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  Choose academic structure
                </Text>

              </View>

            </View>


            <SelectField
              label="ACADEMIC SESSION"
              placeholder="Select session"
              value={
                sessionId
              }
              options={
                sessionOptions
              }
              onSelect={
                handleSessionChange
              }
            />


            <SelectField
              label="CLASS"
              placeholder={
                sessionId
                  ? "Select class"
                  : "Select session first"
              }
              value={
                classId
              }
              options={
                classOptions
              }
              disabled={
                !sessionId
              }
              onSelect={
                handleClassChange
              }
            />


            <SelectField
              label="SECTION"
              placeholder={
                classId
                  ? "Select section"
                  : "Select class first"
              }
              value={
                sectionId
              }
              options={
                sectionOptions
              }
              disabled={
                !classId
              }
              onSelect={
                handleSectionChange
              }
            />


            <Pressable
              disabled={
                timetableLoading
              }
              onPress={
                loadTimetable
              }
              className={
                timetableLoading
                  ? "items-center rounded-2xl bg-[#A9B0E8] py-4"
                  : "items-center rounded-2xl bg-[#4355D8] py-4"
              }
            >

              {timetableLoading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <View className="flex-row items-center">

                  <Ionicons
                    name="calendar-outline"
                    size={19}
                    color="#FFFFFF"
                  />

                  <Text className="ml-2 text-sm font-extrabold text-white">
                    View Timetable
                  </Text>

                </View>
              )}

            </Pressable>

          </View>


          {/* ERROR */}

          {error ? (
            <View className="mt-4 rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">

              <View className="flex-row items-start">

                <Ionicons
                  name="alert-circle-outline"
                  size={19}
                  color="#DC4C5A"
                />

                <Text className="ml-2 flex-1 text-xs font-semibold leading-5 text-[#DC4C5A]">
                  {error}
                </Text>

              </View>

            </View>
          ) : null}


          {/* TIMETABLE */}

          {dataLoaded ? (
            <>

              <View className="mb-5 mt-7">

                <Text className="text-xl font-extrabold text-[#15213B]">
                  Weekly Timetable
                </Text>

                <Text className="mt-1 text-xs text-[#606F88]">
                  {timetable.length} timetable entries
                </Text>

              </View>


              {groupedTimetable.map(
                ({
                  day,
                  records,
                }) => (
                  <View
                    key={day}
                    className="mb-6"
                  >

                    <View className="mb-3 flex-row items-center">

                      <View className="h-8 w-8 items-center justify-center rounded-xl bg-[#15213B]">

                        <Ionicons
                          name="calendar-outline"
                          size={15}
                          color="#FFFFFF"
                        />

                      </View>


                      <Text className="ml-3 text-base font-extrabold text-[#15213B]">
                        {day}
                      </Text>


                      <View className="ml-3 flex-1 border-t border-[#E5E8F0]" />

                    </View>


                    {records.map(
                      (
                        item,
                        index
                      ) => (
                        <PeriodCard
                          key={
                            item._id ??
                            `${day}-${index}`
                          }
                          item={
                            item
                          }
                        />
                      )
                    )}

                  </View>
                )
              )}


              {timetable.length ===
              0 ? (
                <View className="items-center rounded-3xl border border-[#E5E8F0] bg-white py-12">

                  <View className="h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF0FF]">

                    <Ionicons
                      name="calendar-outline"
                      size={35}
                      color="#4355D8"
                    />

                  </View>


                  <Text className="mt-5 text-base font-extrabold text-[#15213B]">
                    No timetable found
                  </Text>


                  <Text className="mt-2 px-8 text-center text-xs leading-5 text-[#606F88]">
                    Selected class and section ke liye timetable entries nahi mili.
                  </Text>

                </View>
              ) : null}

            </>
          ) : null}

        </ScrollView>

      </SafeAreaView>
    );
  };


export default SchoolTimetableScreen;