import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createSlug } from '@/lib/slug-utils';

export default function ExhibitionItem({ exhibition, isFull, priority = false }) {
  const { name, period, description, imageUrl, index, classType } = exhibition;
  const slug = name ? createSlug(name) : null;

  // Exhibition 타입 텍스트 생성
  const getExhibitionTypeText = () => {
    if (classType === 'SOLO EXHIBITION') {
      return 'Solo Exhibition';
    } else if (classType === 'GROUP EXHIBITION') {
      return 'Group Exhibition';
    }
    return '';
  };

  const exhibitionTypeText = getExhibitionTypeText();

  // Exhibition 텍스트와 이미지 콘텐츠 생성
  const periodHtml = period ? <div className="exhibition-period">{period}</div> : '';
  const descriptionContent = description || '';
  const descriptionHtml = (exhibitionTypeText || periodHtml || descriptionContent) ? (
    <div className="description-box">
      {exhibitionTypeText && <div className="exhibition-type">{exhibitionTypeText}</div>}
      {periodHtml}
      {descriptionContent.split('\n').map((line, idx) => (
        <p key={idx} className="artwork-detail-paragraph">{line}</p>
      ))}
    </div>
  ) : null;

  return (
    <div className={`exhibition-item ${isFull ? 'is-full-width-item' : ''}`}>
      <Link href={slug ? `/exhibition/${slug}` : '#'} className="exhibition-item-link">
        <h2 className="exhibition-name">{name}</h2>
        {descriptionHtml}
        {imageUrl && (
          <div className="image-container">
            <Image
              src={imageUrl}
              alt={name || ''}
              width={595}
              height={400}
              className="project-image exhibition-image"
              loading={priority ? undefined : "lazy"}
              priority={priority}
              quality={90}
              sizes="595px"
            />
          </div>
        )}
      </Link>
    </div>
  );
}

