import { IncidentsTable } from "@/components/incidents/table";

export default async function IncidentsPage() {
	return (
		<div className="flex flex-1 flex-col pb-8">
			<IncidentsTable />
		</div>
	);
}
