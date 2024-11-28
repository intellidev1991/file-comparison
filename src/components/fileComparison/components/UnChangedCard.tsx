interface UnChangedCardProps {
  count?: number;
}
export const UnChangedCard: React.FC<UnChangedCardProps> = ({ count }) => {
  return (
    <div className="text-gray-500 italic text-center p-2 bg-gray-100 rounded">
      {count ?? ""} more unchanged sections...
    </div>
  );
};
