import { ExamType } from "@prisma/client";
import { prisma } from "../../lib/prisma";

// Type definitions
type GradeComponentTemplate = {
  id?: string;
  name: string;
  weight: number;
  maxScore: number;
  index: number;
};

type DefineComponentsInput = {
  examType: ExamType;
  components: GradeComponentTemplate[];
};

/**
 * Service for managing grade component templates
 */
export class GradeComponentService {
  // Storage for component templates (simulating a database)
  private static templateStore: Record<string, GradeComponentTemplate[]> = {};

  /**
   * Get component templates for a specific exam type
   */
  static async getComponentTemplates(
    examType: ExamType
  ): Promise<GradeComponentTemplate[]> {
    // Validate exam type
    this.validateExamType(examType);

    // Check if we have templates defined for this exam type
    if (
      this.templateStore[examType] &&
      this.templateStore[examType].length > 0
    ) {
      return this.templateStore[examType];
    }

    // Return default templates
    const defaultTemplates = this.getDefaultTemplates(examType);
    this.templateStore[examType] = defaultTemplates;

    return defaultTemplates;
  }

  /**
   * Define component templates for an exam type
   */
  static async defineComponents(
    input: DefineComponentsInput
  ): Promise<GradeComponentTemplate[]> {
    const { examType, components } = input;

    // Validate exam type
    this.validateExamType(examType);

    // Validate the total weight is approximately 1.0 (allowing small floating point errors)
    const totalWeight = components.reduce((sum, comp) => sum + comp.weight, 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      throw new Error(`Total weight must be 1.0, got ${totalWeight}`);
    }

    // Validate components have required fields
    components.forEach((comp) => {
      if (
        !comp.name ||
        comp.weight === undefined ||
        comp.maxScore === undefined ||
        comp.index === undefined
      ) {
        throw new Error(
          "All components must have name, weight, maxScore, and index fields"
        );
      }

      if (comp.weight <= 0) {
        throw new Error("Component weights must be positive");
      }

      if (comp.maxScore <= 0) {
        throw new Error("Component maxScore must be positive");
      }
    });

    // Add IDs to components if not provided
    const componentsWithIds = components.map((comp, idx) => ({
      ...comp,
      id: comp.id || `${examType.toLowerCase()}_${comp.index || idx + 1}`,
    }));

    // Store the components
    this.templateStore[examType] = componentsWithIds;

    return componentsWithIds;
  }

  /**
   * Calculate a total score based on components and their weights
   */
  static calculateTotalScore(
    components: { id: string; score: number }[],
    examType: ExamType
  ): number {
    // Get the templates for this exam type
    const templates =
      this.templateStore[examType] || this.getDefaultTemplates(examType);

    let weightedScore = 0;
    let weightTotal = 0;

    // Calculate weighted scores
    components.forEach((comp) => {
      // Find the matching template by ID
      const template = templates.find((t) => t.id === comp.id);

      if (template) {
        // Normalize score based on maxScore if needed
        const normalizedScore =
          template.maxScore !== 100
            ? (comp.score / template.maxScore) * 100
            : comp.score;

        weightedScore += normalizedScore * template.weight;
        weightTotal += template.weight;
      }
    });

    // If weights don't add up to 1.0, normalize
    if (weightTotal > 0 && Math.abs(weightTotal - 1.0) > 0.01) {
      weightedScore = weightedScore / weightTotal;
    }

    // Round to 2 decimal places
    return Math.round(weightedScore * 100) / 100;
  }

  /**
   * Get the default templates for each exam type
   */
  private static getDefaultTemplates(
    examType: ExamType
  ): GradeComponentTemplate[] {
    switch (examType) {
      case "MID_TERM":
        return [
          {
            id: "mid_term_1",
            name: "Written Test",
            weight: 0.6,
            maxScore: 100,
            index: 1,
          },
          {
            id: "mid_term_2",
            name: "Practical Assignment",
            weight: 0.3,
            maxScore: 50,
            index: 2,
          },
          {
            id: "mid_term_3",
            name: "Participation",
            weight: 0.1,
            maxScore: 20,
            index: 3,
          },
        ];

      case "FINAL":
        return [
          {
            id: "final_1",
            name: "Final Exam",
            weight: 0.7,
            maxScore: 100,
            index: 1,
          },
          {
            id: "final_2",
            name: "Project",
            weight: 0.3,
            maxScore: 100,
            index: 2,
          },
        ];

      case "DAILY":
        return [
          {
            id: "daily_1",
            name: "Classwork",
            weight: 0.6,
            maxScore: 100,
            index: 1,
          },
          {
            id: "daily_2",
            name: "Homework",
            weight: 0.4,
            maxScore: 100,
            index: 2,
          },
        ];

      case "QUIZ":
        return [
          {
            id: "quiz_1",
            name: "Quiz Score",
            weight: 1.0,
            maxScore: 100,
            index: 1,
          },
        ];

      case "ASSIGNMENT":
        return [
          {
            id: "assignment_1",
            name: "Assignment Score",
            weight: 1.0,
            maxScore: 100,
            index: 1,
          },
        ];

      default:
        // For any unhandled types, provide a generic template
        return [
          {
            id: `${(examType as string).toLowerCase()}_1`,
            name: "Component 1",
            weight: 0.7,
            maxScore: 100,
            index: 1,
          },
          {
            id: `${(examType as string).toLowerCase()}_2`,
            name: "Component 2",
            weight: 0.3,
            maxScore: 100,
            index: 2,
          },
        ];
    }
  }

  /**
   * Validate that the exam type is valid
   */
  private static validateExamType(examType: ExamType): void {
    // This assumes ExamType is an enum in your Prisma schema
    const validTypes = Object.values(ExamType);

    if (!validTypes.includes(examType as any)) {
      throw new Error(
        `Invalid exam type: ${examType}. Valid types are: ${validTypes.join(
          ", "
        )}`
      );
    }
  }
}
