export interface ExamModule {
  name: string; // e.g. "Listening", "Reading", "Writing", "Speaking"
  targetScore: string;
  currentMockScore: string;
  weakAreas: string[];
  recommendedResources: Array<{
    title: string;
    url: string;
    type: 'Official' | 'Practice Tool' | 'Strategy Guide';
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

export const initialIeltsPlan = {
  examName: "IELTS Academic",
  targetScore: "7.5 (Min 6.5 in all bands)",
  examDate: "2026-10-10",
  registrationDeadline: "2026-09-25",
  modules: [
    {
      name: "Listening",
      targetScore: "8.0",
      currentMockScore: "7.5",
      weakAreas: ["Part 4 Academic Lectures - fast rate of speech", "Spelling of technical words under pressure"],
      recommendedResources: [
        { title: "IELTS Official Practice Test - Cambridge 18/19", url: "https://www.ielts.org/for-test-takers/sample-test-questions", type: "Official" },
        { title: "BBC 6 Minute English Podcast", url: "https://www.bbc.co.uk/learningenglish/", type: "Practice Tool" }
      ]
    },
    {
      name: "Reading",
      targetScore: "8.0",
      currentMockScore: "7.0",
      weakAreas: ["True / False / Not Given distinctions", "Matching Headings in scientific AI/Tech articles"],
      recommendedResources: [
        { title: "IELTS Academic Reading Sample Passages", url: "https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests/reading", type: "Official" }
      ]
    },
    {
      name: "Writing",
      targetScore: "7.5",
      currentMockScore: "6.5",
      weakAreas: ["Task 1 Complex Chart Comparisons", "Task 2 Academic Essay cohesive devices & formal lexicon"],
      recommendedResources: [
        { title: "British Council Task 2 Band 9 Sample Essays", url: "https://takeielts.britishcouncil.org/take-ielts/prepare", type: "Official" },
        { title: "IELTS Liz Essay Structures & Connectors", url: "https://ieltsliz.com/", type: "Strategy Guide" }
      ]
    },
    {
      name: "Speaking",
      targetScore: "7.5",
      currentMockScore: "7.0",
      weakAreas: ["Part 3 Abstract Discussion elaboration", "Idiomatic phrasing without hesitation"],
      recommendedResources: [
        { title: "British Council Speaking Mock Videos", url: "https://takeielts.britishcouncil.org/", type: "Official" }
      ]
    }
  ] as ExamModule[],
  sample60DaySchedule: [
    { dayNumber: 1, week: 1, topic: "IELTS Format Overview & Diagnostic Mock Test", focusArea: "All Sections", actionItems: ["Take Cambridge 18 Test 1 diagnostic under strict timing", "Log baseline scores"], completed: true },
    { dayNumber: 2, week: 1, topic: "Reading - True/False/Not Given Mastery", focusArea: "Reading", actionItems: ["Analyze key word synonyms in passage vs question", "Solve 3 passage sets"], completed: true },
    { dayNumber: 3, week: 1, topic: "Writing Task 1 - Line Graphs & Bar Charts", focusArea: "Writing", actionItems: ["Learn overview paragraph structure", "Write 2 Task 1 reports for review"], completed: false },
    { dayNumber: 4, week: 1, topic: "Listening - Part 1 & 2 Form Completion & Maps", focusArea: "Listening", actionItems: ["Practice distraction keywords", "Listen to Cambridge 18 Test 2"], completed: false },
    { dayNumber: 5, week: 1, topic: "Speaking - Part 1 Personal Background & Tech Topics", focusArea: "Speaking", actionItems: ["Record 5 audio responses about Software & AI background", "Analyze pauses"], completed: false },
    { dayNumber: 6, week: 1, topic: "Writing Task 2 - Opinion & Discussion Essay Structures", focusArea: "Writing", actionItems: ["Master 4-paragraph structure", "Write Task 2 essay on AI & Automation"], completed: false },
    { dayNumber: 7, week: 1, topic: "Weekly Full Practice Review & Error Log", focusArea: "Review", actionItems: ["Review all wrong answers from Week 1", "Re-attempt failed reading questions"], completed: false }
  ] as StudyScheduleDay[]
};
