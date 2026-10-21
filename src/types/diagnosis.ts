export type DiagnosisInput = {
 name: string; industry: string; region: string; employees: number;
 revenue: number; materials: number; labor: number; rent: number; other: number;
 fixedCosts?: Record<string, number>;
 repeatCustomers: number; digital: number;
};
export type DiagnosisErrors = Partial<Record<keyof DiagnosisInput | `fixedCosts.${string}`, string>>;
export type NumericInputKey = Exclude<keyof DiagnosisInput, "name" | "industry" | "region" | "fixedCosts">;
export type Recommendation = { title: string; description: string; priority: string };
export type DiagnosisResult = { score: number; profit: number; margin: number; costs: number; fixedCosts: number; categories: { label: string; score: number; description: string }[]; recommendations: Recommendation[] };
export type DiagnosisRecord = { id: string; createdAt: string; input: DiagnosisInput };
