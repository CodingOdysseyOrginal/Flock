"use client";

import styles from "./BioCard.module.css";

interface BioCardProps {
  isEditing: boolean;
  editedUser: { name: string; email: string; bio: string };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSave: () => void;
  handleCancel: () => void;
}

export default function BioCard({
  isEditing,
  editedUser,
  handleChange,
  handleSave,
  handleCancel,
}: BioCardProps) {
  return (
    <div className={styles.bioCardContainer}>
      {isEditing ? (
        <>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
          />

          <label>Bio:</label>
          <textarea name="bio" value={editedUser.bio} onChange={handleChange} />

          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <p>
            <span className={styles.boldBio}></span> Hi I&apos;m Lara 🌸
          </p>
          <p>I&apos;m based in the UK!</p>
          <p>I love stamp collecting and Art!</p>
          <br />
          <p>
            <span className={styles.boldBio}>Name:</span> Lara Thompson
          </p>
          <p>
            <span className={styles.boldBio}>Email:</span> lara97@hotmail.co.uk
          </p>
        </>
      )}
    </div>
  );
}
