export type ProjectResponse = {
	id: string;
	name: string;
	budget: number;
	timeBudget: number;
	rate: number;
	createdAt: string;
	updatedAt: string;
};

export const Transformers = {
	project: (response: ProjectResponse) => ({
		id: response.id.toString(),
		name: response.name,
		budget: response.budget,
		timeBudget: response.timeBudget,
		rate: response.rate,
		createdAt: response.createdAt,
		updatedAt: response.updatedAt
	})
};
