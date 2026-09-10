export interface ExamModule {
  name: string;
  targetScore: string;
  currentMockScore: string;
  weakAreas: string[];
  recommendedResources: Array<{
    title: string;
    url: string;
    type: "Official" | "Practice Tool" | "Strategy Guide";
  }>;
}

export interface StudyScheduleDay {
  dayNumber: number;
  week: number;
  topic: string;
  focusArea: string;
  actionItems: string[];
  completed: boolean;
}

export interface ExamPlan {
  examName: string;
  targetScore: string;
  currentMockScore: string;
  examDate: string;
  modules: ExamModule[];
  studySchedule: StudyScheduleDay[];
}

export async function fetchLiveExamPlan(params: {
  examName: string;
  targetScore: string;
  currentMockScore: string;
  examDate?: string;
  weaknesses?: string;
  candidate?: any;
}): Promise<ExamPlan | null> {
  try {
    const res = await fetch("/api/ai/exam-planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    console.error("Failed to generate live exam plan:", err);
  }
  return null;
}
