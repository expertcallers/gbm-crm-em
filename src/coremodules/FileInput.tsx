import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

type Props =
	{
		id?: string;
		name?: string;
		hint?: string;
		title?: string;
		required: boolean;
		className?: string;
		accept: string;
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
		onDelete?: (id: string) => void;
		isDeleting?: boolean;
		errorDeleting?: string | null;
		defaultValue?: string | string[] | null;
		disabled?: boolean;
		multiple?: boolean;
		placeholder?: string;
		onDownloadFile?: (link: string, name: string) => void;
	}

const FileInput: React.FC<Props> = ({
	id,
	name,
	title = "File",
	placeholder,
	hint,
	required,
	className = '',
	accept,
	onChange,
	onDelete,
	isDeleting,
	errorDeleting,
	defaultValue,
	disabled,
	multiple,
	onDownloadFile,
}) => {

	const [ids, setIds] = useState<string[]>([]);

	useEffect(() => {
		if (!defaultValue) return;
		if (typeof defaultValue === "string") return setIds([defaultValue.split('/').reverse()[0]]);
		setIds(defaultValue.map(link => link.split('/').reverse()[0]));
	}, [defaultValue])

	return (
		<label
			onClick={e => e.stopPropagation()}
			className={`flex flex-col rounded-md px-4 py-3 border border-gray-light ${className ? className : ''} ${disabled ? 'bg-disabled' : 'cursor-pointer'}`}
		>
			{!disabled && placeholder && <p className="text-sm text-gray mb-2">{placeholder}</p>}
			{disabled && !defaultValue && <p className="text-sm text-gray">No file</p>}
			{
				!defaultValue ? null : (
					<div className="flex flex-col">
						{
							typeof defaultValue === "string" ? <FilePreview onDownloadFile={onDownloadFile} id={ids[0]} link={defaultValue} onDelete={onDelete} isDeleting={isDeleting} errorDeleting={errorDeleting} value={defaultValue} title={title} /> :
								defaultValue.map((link, i) => (
									<FilePreview onDownloadFile={onDownloadFile} key={defaultValue[i]} i={i} id={ids[i]} link={link} onDelete={onDelete} isDeleting={isDeleting} errorDeleting={errorDeleting} value={defaultValue} title={title} />
								))
						}
					</div>
				)
			}
			{
				disabled ? null : (
					<input
						id={id}
						name={name}
						type="file"
						title={hint}
						required={required}
						disabled={disabled}
						accept={accept}
						className="w-full h-full text-gray-dark uppercase text-xs"
						onChange={onChange}
						multiple={multiple}
					/>
				)
			}
		</label>
	)
}

type FilePreviewProps =
	{
		i?: number;
		id: string;
		link: string;
		title: string;
		value?: string | string[];
		onDelete?: (id: string) => void;
		isDeleting?: boolean;
		errorDeleting?: string | null;
		onDownloadFile?: (link: string, name: string) => void;
	}

const FilePreview: React.FC<FilePreviewProps> = ({ i, id, link, title, value, onDelete, isDeleting, errorDeleting, onDownloadFile }) => {

	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (typeof errorDeleting !== "string") return;
		if (!errorDeleting) return setError(null);
		const [eid, message] = errorDeleting.split(":");
		if (eid === id) setError(message);
	}, [errorDeleting, id])

	if (!value) return null;

	const onClickDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		e.preventDefault();
		if (isDeleting || !onDelete) return;
		onDelete(id);
	}

	return (
		<span key={id + i} className="mb-3">
			<span className="flex">
				<button
					className="text-start text-primary underline font-bold"
					type="button"
					onClick={() => onDownloadFile && onDownloadFile(link, title)}
				>View {title} {typeof i === "number" ? i + 1 : ''}</button>
				{onDelete && <button onClick={onClickDelete} type="button"><IoTrashOutline size={16} className="ml-2 text-rose" /></button>}
			</span>
			{error && <span className="text-rose text-sm">{error}</span>}
		</span>
	)
}

export default FileInput;