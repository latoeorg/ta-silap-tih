import { ExamType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type GradeComponentTemplate = {
  id: string;
  name: string;
  examType: ExamType;
  weight: number;
};

export class GradeComponentService {
  /**
   * Get component templates for a specific exam type
   * This service returns the expected components for a grade based on exam type
   */
  static async getComponentTemplates(
    examType: ExamType
  ): Promise<GradeComponentTemplate[]> {
    // In a real-world scenario, these templates would likely come from the database
    // For now, we're defining them statically based on the exam type

    // Check if the provided examType is valid
    const validExamTypes = Object.values(ExamType);
    if (!validExamTypes.includes(examType as any)) {
      throw new Error(`Invalid exam type: ${examType}`);
    }

    // Return predefined templates based on exam type
    switch (examType) {
      case "DAILY":
        return [
          { id: "daily-1", name: "Class Activity", examType, weight: 0.6 },
          { id: "daily-2", name: "Homework", examType, weight: 0.4 },
        ];

      // Add other exam types as needed based on your schema's ExamType enum
      // For example (these would need to be adjusted based on your actual ExamType values):
      case "MID_TERM":
        return [
          { id: "mid-1", name: "Written Test", examType, weight: 0.5 },
          { id: "mid-2", name: "Practical", examType, weight: 0.3 },
          { id: "mid-3", name: "Project", examType, weight: 0.2 },
        ];

      case "FINAL":
        return [
          { id: "final-1", name: "Written Exam", examType, weight: 0.6 },
          { id: "final-2", name: "Practical Exam", examType, weight: 0.4 },
        ];

      case "QUIZ":
        return [{ id: "quiz-1", name: "Quiz Score", examType, weight: 1.0 }];

      case "ASSIGNMENT":
        return [
          {
            id: "assignment-1",
            name: "Assignment Score",
            examType,
            weight: 1.0,
          },
        ];

      default:
        // For any unhandled exam types, return a generic component
        return [
          {
            id: `${examType}-1`,
            name: `${examType} Score`,
            examType,
            weight: 1.0,
          },
        ];
    }
  }

  /**
   * Get the components of a specific grade
   */
  static async getGradeComponents(gradeId: string) {
    const components = await prisma.gradeComponent.findMany({
      where: { gradeId },
      orderBy: { index: "asc" },
    });

    if (!components.length) {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId },
      });

      if (!grade) {
        throw new Error("Grade not found");
      }
    }

    return components;
  }

  /**
   * Calculate the total score based on component scores and weights
   */
  static calculateTotalScore(
    components: { score: number; index: number }[],
    templates: GradeComponentTemplate[]
  ): number {
    // Match components to templates by index and calculate weighted score
    let totalScore = 0;
    let totalWeight = 0;

    components.forEach((component, idx) => {
      if (idx < templates.length) {
        const template = templates[idx];
        totalScore += component.score * template.weight;
        totalWeight += template.weight;
      }
    });

    // Normalize if weights don't add up to 1
    if (totalWeight > 0 && totalWeight !== 1) {
      totalScore = totalScore / totalWeight;
    }

    return parseFloat(totalScore.toFixed(2)); // Round to 2 decimal places
  }
}
