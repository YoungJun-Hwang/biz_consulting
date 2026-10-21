export type DiagnosisInput = {
 name: string; industry: string; region: string; employees: number;
 revenue: number; materials: number; labor: number; rent: number; other: number;
 repeatCustomers: number; digital: number;
};
export type Recommendation = { title: string; description: string; priority: string };
export type DiagnosisResult = { score: number; profit: number; margin: number; costs: number; categories: { label: string; score: number; description: string }[]; recommendations: Recommendation[] };
export type DiagnosisRecord = { id: string; createdAt: string; input: DiagnosisInput };
