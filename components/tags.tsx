import utilStyles from '../styles/utils.module.css';

export default function Tags({ tagList }: { tagList: string[] }) {
  return (
    <>
      {tagList.map((tag) => (
        <span key={tag} className={utilStyles.tag}>
          {`#${tag}`}
        </span>
      ))}
    </>
  );
}
