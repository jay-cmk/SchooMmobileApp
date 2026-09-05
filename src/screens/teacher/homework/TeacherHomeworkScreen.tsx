import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import type { CompositeNavigationProp } from '@react-navigation/native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from '../../../api/axios';

import type { TeacherStackParamList, TeacherTabParamList } from 'types/navigation.types';

/* =====================================================
   NAVIGATION
===================================================== */

type TeacherHomeworkNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TeacherTabParamList, 'Homework'>,
  NativeStackNavigationProp<TeacherStackParamList>
>;

/* =====================================================
   TYPES
===================================================== */

type HomeworkStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'ARCHIVED';

interface RelationItem {
  _id?: string;
  id?: string;

  name?: string;
  title?: string;
  code?: string;

  employeeId?: string;
}

interface Homework {
  _id?: string;
  id?: string;

  title?: string;
  description?: string;

  sessionId?: string | RelationItem;

  classId?: string | RelationItem;

  sectionId?: string | RelationItem;

  subjectId?: string | RelationItem;

  teacherId?: string | RelationItem;

  assignedDate?: string;
  dueDate?: string;

  status?: HomeworkStatus | string;

  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

/* =====================================================
   HELPERS
===================================================== */

const getApiData = (response: any): any => {
  return response?.data?.data ?? response?.data ?? null;
};

/* =====================================================
   EXTRACT ARRAY
===================================================== */

const extractArray = (value: any, keys: string[]): any[] => {
  if (Array.isArray(value)) {
    return value;
  }

  for (const key of keys) {
    if (Array.isArray(value?.[key])) {
      return value[key];
    }
  }

  return [];
};

/* =====================================================
   RELATION NAME
===================================================== */

const getName = (value: unknown): string => {
  if (!value || typeof value === 'string') {
    return '';
  }

  if (typeof value === 'object') {
    const item = value as RelationItem;

    return item.name ?? item.title ?? item.code ?? '';
  }

  return '';
};

const getRelationId = (value: unknown): string => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    const item = value as RelationItem;

    return item._id ?? item.id ?? '';
  }

  return '';
};

/* =====================================================
   HOMEWORK ID
===================================================== */

const getHomeworkId = (homework: Homework): string => {
  return homework._id ?? homework.id ?? '';
};

/* =====================================================
   DATE
===================================================== */

const formatDisplayDate = (value?: string): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/* =====================================================
   DAYS LEFT
===================================================== */

const getDaysLeft = (dueDate?: string): number | null => {
  if (!dueDate) {
    return null;
  }

  const due = new Date(dueDate);

  if (Number.isNaN(due.getTime())) {
    return null;
  }

  due.setHours(23, 59, 59, 999);

  const now = new Date();

  const difference = due.getTime() - now.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

/* =====================================================
   STATUS UI
===================================================== */

const getStatusUI = (status?: string) => {
  switch (status) {
    case 'PUBLISHED':
      return {
        label: 'Published',

        container: 'bg-[#E7F7F1]',

        text: 'text-[#2BAA7B]',
      };

    case 'DRAFT':
      return {
        label: 'Draft',

        container: 'bg-[#FFF2DE]',

        text: 'text-[#E59A2F]',
      };

    case 'COMPLETED':
      return {
        label: 'Completed',

        container: 'bg-[#EEF0FF]',

        text: 'text-[#4355D8]',
      };

    case 'ARCHIVED':
      return {
        label: 'Archived',

        container: 'bg-[#EEF0F3]',

        text: 'text-[#606F88]',
      };

    default:
      return {
        label: status ?? 'Unknown',

        container: 'bg-[#EEF0F3]',

        text: 'text-[#606F88]',
      };
  }
};

/* =====================================================
   SCREEN
===================================================== */

const TeacherHomeworkScreen = () => {
  const navigation = useNavigation<TeacherHomeworkNavigationProp>();

  /* =================================================
       STATE
    ================================================= */

  const [homeworks, setHomeworks] = useState<Homework[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'COMPLETED'>(
    'ALL'
  );

  /* =================================================
       FETCH HOMEWORK
    ================================================= */

  const fetchHomeworks = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError(null);

      const response = await api.get('/homework', {
        params: {
          page: 1,
          limit: 100,
        },
      });

      const data = getApiData(response);

      const list = extractArray(data, ['homeworks', 'homework', 'data']);

      setHomeworks(list);
    } catch (err: any) {
      console.log('TEACHER HOMEWORK ERROR:', err?.response?.data ?? err?.message);

      setError(err?.response?.data?.message ?? 'Homework load nahi ho saka.');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  /* =================================================
       INITIAL LOAD
    ================================================= */

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  /* =================================================
       REFRESH
    ================================================= */

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchHomeworks(false);
    } finally {
      setRefreshing(false);
    }
  };

  /* =================================================
       STATS
    ================================================= */

  const stats = useMemo(() => {
    let published = 0;

    let draft = 0;

    let completed = 0;

    homeworks.forEach((homework) => {
      switch (homework.status) {
        case 'PUBLISHED':
          published += 1;
          break;

        case 'DRAFT':
          draft += 1;
          break;

        case 'COMPLETED':
          completed += 1;
          break;
      }
    });

    return {
      total: homeworks.length,

      published,
      draft,
      completed,
    };
  }, [homeworks]);

  /* =================================================
       FILTERED HOMEWORK
    ================================================= */

  const filteredHomeworks = useMemo(() => {
    if (selectedFilter === 'ALL') {
      return homeworks;
    }

    return homeworks.filter((homework) => homework.status === selectedFilter);
  }, [homeworks, selectedFilter]);

  /* =================================================
       CREATE
    ================================================= */

  const openCreateHomework = () => {
    navigation.navigate('CreateHomework');
  };

  /* =================================================
       REVIEW
    ================================================= */

  const openReview = (homework: Homework) => {
    const homeworkId = getHomeworkId(homework);

    const sessionId = getRelationId(homework.sessionId);

    const classId = getRelationId(homework.classId);

    const sectionId = getRelationId(homework.sectionId);

    if (!homeworkId || !sessionId || !classId || !sectionId) {
      return;
    }

    navigation.navigate('HomeworkReview', {
      homeworkId,

      sessionId,

      classId,

      sectionId,

      ...(homework.title
        ? {
            homeworkTitle: homework.title,
          }
        : {}),
    });
  };

  /* =================================================
       INITIAL LOADING
    ================================================= */

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#F7F7FB]">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">
          <Ionicons name="book-outline" size={30} color="#4355D8" />
        </View>

        <ActivityIndicator className="mt-5" size="large" color="#4355D8" />

        <Text className="mt-3 text-sm font-semibold text-[#606F88]">Loading homework...</Text>
      </SafeAreaView>
    );
  }

  /* =================================================
       UI
    ================================================= */

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-[#F7F7FB]">
      {/* =============================================
            HEADER
        ============================================= */}

      <View className="bg-[#4355D8] px-5 pb-7 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-extrabold text-white">Homework</Text>

            <Text className="mt-1 text-xs text-white/70">Manage your class assignments</Text>
          </View>

          <Pressable
            onPress={openCreateHomework}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
            <Ionicons name="add" size={25} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-28"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4355D8" />
        }>
        {/* =========================================
              STATS
          ========================================= */}

        <View className="px-5 pt-5">
          <View className="flex-row gap-2">
            <View className="flex-1 rounded-2xl bg-white p-3">
              <Text className="text-[9px] font-extrabold text-[#606F88]">TOTAL</Text>

              <Text className="mt-1 text-xl font-extrabold text-[#15213B]">{stats.total}</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#E7F7F1] p-3">
              <Text className="text-[9px] font-extrabold text-[#2BAA7B]">ACTIVE</Text>

              <Text className="mt-1 text-xl font-extrabold text-[#2BAA7B]">{stats.published}</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#FFF2DE] p-3">
              <Text className="text-[9px] font-extrabold text-[#E59A2F]">DRAFT</Text>

              <Text className="mt-1 text-xl font-extrabold text-[#E59A2F]">{stats.draft}</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-[#EEF0FF] p-3">
              <Text className="text-[9px] font-extrabold text-[#4355D8]">DONE</Text>

              <Text className="mt-1 text-xl font-extrabold text-[#4355D8]">{stats.completed}</Text>
            </View>
          </View>
        </View>

        {/* =========================================
              FILTERS
          ========================================= */}

        <View className="pt-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-5">
            {[
              {
                key: 'ALL',
                label: 'All',
              },
              {
                key: 'PUBLISHED',
                label: 'Published',
              },
              {
                key: 'DRAFT',
                label: 'Draft',
              },
              {
                key: 'COMPLETED',
                label: 'Completed',
              },
            ].map((item) => {
              const active = selectedFilter === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() =>
                    setSelectedFilter(item.key as 'ALL' | 'PUBLISHED' | 'DRAFT' | 'COMPLETED')
                  }
                  className={`mr-2 rounded-full border px-4 py-2.5 ${
                    active ? 'border-[#4355D8] bg-[#4355D8]' : 'border-[#E5E8F0] bg-white'
                  }`}>
                  <Text className={`text-xs font-bold ${active ? 'text-white' : 'text-[#606F88]'}`}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* =========================================
              ERROR
          ========================================= */}

        {error ? (
          <View className="px-5 pt-5">
            <View className="rounded-2xl border border-[#F4CED3] bg-[#FDECEE] p-4">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle-outline" size={20} color="#DC4C5A" />

                <Text className="ml-2 flex-1 text-xs font-semibold text-[#DC4C5A]">{error}</Text>
              </View>

              <Pressable
                onPress={() => fetchHomeworks()}
                className="mt-3 self-start rounded-lg bg-[#DC4C5A] px-4 py-2">
                <Text className="text-xs font-bold text-white">Retry</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* =========================================
              TITLE
          ========================================= */}

        <View className="flex-row items-center justify-between px-5 pb-3 pt-6">
          <View>
            <Text className="text-lg font-extrabold text-[#15213B]">My Homework</Text>

            <Text className="mt-1 text-xs text-[#606F88]">
              {filteredHomeworks.length} assignment
              {filteredHomeworks.length === 1 ? '' : 's'}
            </Text>
          </View>

          <Pressable
            onPress={openCreateHomework}
            className="flex-row items-center rounded-xl bg-[#EEF0FF] px-3 py-2.5">
            <Ionicons name="add-circle-outline" size={17} color="#4355D8" />

            <Text className="ml-1.5 text-[10px] font-extrabold text-[#4355D8]">Create</Text>
          </Pressable>
        </View>

        {/* =========================================
              LIST
          ========================================= */}

        {filteredHomeworks.length > 0 ? (
          <View className="px-5">
            {filteredHomeworks.map((homework) => {
              const homeworkId = getHomeworkId(homework);

              const statusUI = getStatusUI(homework.status);

              const daysLeft = getDaysLeft(homework.dueDate);

              const className = getName(homework.classId) || 'Class';

              const sectionName = getName(homework.sectionId) || 'Section';

              const subjectName = getName(homework.subjectId) || 'Subject';

              return (
                <View
                  key={homeworkId}
                  className="mb-4 overflow-hidden rounded-3xl border border-[#E5E8F0] bg-white">
                  {/* TOP */}

                  <View className="p-5">
                    <View className="flex-row items-start">
                      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF0FF]">
                        <Ionicons name="document-text-outline" size={23} color="#4355D8" />
                      </View>

                      <View className="ml-3 flex-1">
                        <View className="flex-row items-start justify-between">
                          <View className="flex-1 pr-2">
                            <Text
                              numberOfLines={2}
                              className="text-base font-extrabold text-[#15213B]">
                              {homework.title ?? 'Homework'}
                            </Text>

                            <Text className="mt-1 text-xs font-bold text-[#4355D8]">
                              {subjectName}
                            </Text>
                          </View>

                          <View className={`rounded-full px-2.5 py-1.5 ${statusUI.container}`}>
                            <Text className={`text-[9px] font-extrabold ${statusUI.text}`}>
                              {statusUI.label}
                            </Text>
                          </View>
                        </View>

                        <Text className="mt-2 text-xs text-[#606F88]">
                          {className} • Section {sectionName}
                        </Text>
                      </View>
                    </View>

                    {/* DESCRIPTION */}

                    {homework.description ? (
                      <Text numberOfLines={3} className="mt-4 text-xs leading-5 text-[#606F88]">
                        {homework.description}
                      </Text>
                    ) : null}

                    {/* DATES */}

                    <View className="mt-4 flex-row rounded-2xl bg-[#F7F7FB] p-3">
                      <View className="flex-1">
                        <Text className="text-[9px] font-bold text-[#9AA4B5]">ASSIGNED</Text>

                        <Text className="mt-1 text-xs font-extrabold text-[#15213B]">
                          {formatDisplayDate(homework.assignedDate)}
                        </Text>
                      </View>

                      <View className="mx-3 w-px bg-[#E5E8F0]" />

                      <View className="flex-1">
                        <Text className="text-[9px] font-bold text-[#9AA4B5]">DUE DATE</Text>

                        <Text className="mt-1 text-xs font-extrabold text-[#15213B]">
                          {formatDisplayDate(homework.dueDate)}
                        </Text>
                      </View>
                    </View>

                    {/* DUE STATUS */}

                    {daysLeft !== null ? (
                      <View className="mt-3 flex-row items-center">
                        <Ionicons
                          name={daysLeft < 0 ? 'alert-circle-outline' : 'time-outline'}
                          size={15}
                          color={daysLeft < 0 ? '#DC4C5A' : daysLeft <= 2 ? '#E59A2F' : '#606F88'}
                        />

                        <Text
                          className={`ml-1.5 text-[10px] font-bold ${
                            daysLeft < 0
                              ? 'text-[#DC4C5A]'
                              : daysLeft <= 2
                                ? 'text-[#E59A2F]'
                                : 'text-[#606F88]'
                          }`}>
                          {daysLeft < 0
                            ? `Overdue by ${Math.abs(daysLeft)} day(s)`
                            : daysLeft === 0
                              ? 'Due today'
                              : `${daysLeft} day(s) remaining`}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* REVIEW BUTTON */}

                  <View className="border-t border-[#EEF0F3] p-4">
                    <Pressable
                      onPress={() => openReview(homework)}
                      className="flex-row items-center justify-between rounded-2xl bg-[#EEF0FF] px-4 py-3.5">
                      <View className="flex-row items-center">
                        <View className="h-8 w-8 items-center justify-center rounded-xl bg-white">
                          <Ionicons name="people-outline" size={17} color="#4355D8" />
                        </View>

                        <View className="ml-3">
                          <Text className="text-xs font-extrabold text-[#4355D8]">
                            Review Submissions
                          </Text>

                          <Text className="mt-0.5 text-[9px] text-[#606F88]">
                            View student work
                          </Text>
                        </View>
                      </View>

                      <Ionicons name="chevron-forward" size={18} color="#4355D8" />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="mx-5 mt-3 items-center rounded-3xl border border-dashed border-[#D8DDEA] bg-white px-6 py-12">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#EEF0FF]">
              <Ionicons name="book-outline" size={30} color="#4355D8" />
            </View>

            <Text className="mt-4 text-base font-extrabold text-[#15213B]">No homework found</Text>

            <Text className="mt-2 text-center text-xs leading-5 text-[#606F88]">
              Is filter me abhi koi homework nahi mila.
            </Text>

            <Pressable
              onPress={openCreateHomework}
              className="mt-5 flex-row items-center rounded-xl bg-[#4355D8] px-5 py-3">
              <Ionicons name="add" size={17} color="#FFFFFF" />

              <Text className="ml-1.5 text-xs font-extrabold text-white">Create Homework</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TeacherHomeworkScreen;
