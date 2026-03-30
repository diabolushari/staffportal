export default function Field({ label, value, link }: { label: string; value: any, link?: string }) {
	return (
		<div className="space-y-1">
			<label className="text-sm font-normal text-[#252c32]">{label}</label>
			<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
				{value ?? "-"}
			</div>
			{link && (
				<a
					className="text-blue-500 hover:underline"
					href={link}
				>
					Download
				</a>
			)}
		</div>
	);
}