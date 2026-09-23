import { editorialMentions } from "../constants";

const EditorialSection = () => {
  return (
    <div className="editorial-strip fade-up">
      {editorialMentions.map((name) => (
        <span key={name}>{name}</span>
      ))}
    </div>
  );
};

export default EditorialSection;
