type Props = {
  data: { label: string; value: string | number }[];
};

const InfoPanel = ({ data }: Props) => {
  return (
    <div className="absolute bottom-5 right-5 z-10 flex flex-col items-end gap-2 text-white text-sm">
      {data.map((item, index) => (
        <span
          key={index}
          className="p-2 w-fit bg-stone-950/75 rounded-md shadow-md"
        >
          {item.label}: {item.value}
        </span>
      ))}
    </div>
  );
};

export default InfoPanel;
