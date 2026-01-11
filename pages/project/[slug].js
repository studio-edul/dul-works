import Layout from '../../components/Layout';
import { useState, useEffect } from 'react';
import { getProjectBySlug, getAllProjectSlugs } from '../../lib/project-data';

export default function ProjectDetail({ project, slug }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [pinModal, setPinModal] = useState({ open: false, title: '', coord: '' });

  if (!project) {
    return (
      <Layout title="Portfolio - Project Detail">
        <div>프로젝트를 찾을 수 없습니다.</div>
      </Layout>
    );
  }

  // 슬라이더 이벤트 핸들러
  const handleSliderMove = (clientX) => {
    const slider = document.getElementById('project-slider');
    if (!slider) return;
    
    const rect = slider.getBoundingClientRect();
    let pos = clientX - rect.left;
    if (pos < 0) pos = 0;
    if (pos > rect.width) pos = rect.width;
    
    const percent = (pos / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSliderMove(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const openPin = (title, coord) => {
    setPinModal({ open: true, title, coord });
  };

  const closePin = () => {
    setPinModal({ open: false, title: '', coord: '' });
  };

  const { sections, footer } = project;
  const isNewbornSpace = slug === 'newborn-space';

  return (
    <Layout title={`Portfolio - ${project.name}`}>
      <div className={`project-detail-container ${isNewbornSpace ? 'newborn-space' : ''}`}>
        {/* Header Section */}
        <header className="project-detail-header">
          <div className="project-detail-header-content">
            {!isNewbornSpace && <p className="project-detail-mono">R&D LABORATORY</p>}
            <h1 className="project-detail-title">
              {isNewbornSpace ? (
                project.name
              ) : (
                project.name.split(':').map((part, idx) => (
                  <span key={idx}>
                    {idx === 1 ? (
                      <span className="project-detail-accent">{part}</span>
                    ) : (
                      part
                    )}
                    {idx === 0 && ':'}
                  </span>
                ))
              )}
            </h1>
            {project.description && !isNewbornSpace && (
              <div className="project-detail-abstract">
                <p><strong>[Abstract]</strong> {project.description}</p>
              </div>
            )}
          </div>
        </header>

        {/* 신생공 페이지 섹션들 */}
        {isNewbornSpace && (
          <div className="project-detail-newborn-sections">
            <div className="project-detail-newborn-section-wrapper">
              <section className="project-detail-newborn-section">
                <h2 className="project-detail-newborn-title">PROJECT OVERVIEW</h2>
                <div className="project-detail-newborn-content">
                  <p className="project-detail-newborn-paragraph">
                    Rapid advancements in media technology have blurred the boundaries between physical reality and virtual space, fundamentally reshaping how we enjoy and experience space. Contemporary individuals, accustomed to the infinite variations of digital space, demand new stimuli and experiences even within essentially fixed physical environments. However, these fixed physical forms face limitations in keeping pace with the rapidly changing speed of sensory experience. Amidst this flow of the times, <span>'Newborn' seeks sustainable values that allow physical space to be continuously enjoyed.</span>
                  </p>
                  <p className="project-detail-newborn-paragraph">
                    Project 'Newborn Space' is an experiment that predicts and implements future cultural patterns through contemporary technology. It is an attempt to grant a new form—befitting current and future technological environments—to things destined to disappear due to technology, thereby allowing their existence to continue. In this context, 'Newborn Space' <span>moves away from the vision that has dominated the basis of spatial perception and summons the marginalized 'auditory sense' to the center.</span> While vision clearly separates and defines objects, sound flows without boundaries, permeating and filling the gaps of space, functioning as an invisible medium. Auditory information, which we perceive but often do not consciously register, indirectly conveys information about a space. This project brings these auditory layers to the forefront, attempting <span>'Spatial Upcycling'</span> to endow familiar physical spaces with invisible value. Instead of physical reconstruction, it adopts a method of collecting and reinterpreting sound information inherent in a location to overlay layers of invisible experience onto the space. This is a complete paradigm shift that <span>subverts solid Ocularcentrism</span> and allows space to be sensed anew through audible vibrations rather than visible forms.
                  </p>
                  <p className="project-detail-newborn-paragraph">
                    'Newborn Space' is not a fixed entity but an organic landscape that is constantly created and extinguished according to sound waves. Artificial intelligence, having learned 360-degree audiovisual data collected from various locations, constructs a virtual space solely based on input sound, with visual information eliminated. The AI in the work functions beyond a simple computing device; it acts as a <span>'Synesthetic Narrator'</span> that senses forests, oceans, and unknown spaces within the collected data. The process where cold urban noise is reduced to images of dense forests, while the flowing sounds of nature transition into dry mechanical forms, provides the audience with an intense synesthetic expansion. Paradoxically, this allows contemporaries accustomed to the infinite variations of digital space to <span>experience the most immersive 'The Real'</span> within a physical space.
                  </p>
                  <p className="project-detail-newborn-paragraph">
                    Through a landscape of sound that rejects fixed forms and flows endlessly, 'Newborn Space' makes the audience perceive familiar daily spaces as unfamiliar and rediscover the infinite possibilities inherent within them. Standing before a space where auditory senses interpret and AI recreates—beyond the physical reality defined by vision—the audience comes to gaze at the flip side of the physical world we stand on. This is an artistic performance that goes beyond simple aesthetic appreciation of space, presenting a new existential meaning for physical space in response to the expanding digital realm, and <span>fundamentally rethinking the way humans relate to space.</span>
                  </p>
                </div>
              </section>
            </div>
            <div className="project-detail-newborn-section-wrapper">
              <section className="project-detail-newborn-section">
                <h2 className="project-detail-newborn-title">TECHNICAL PROCESS</h2>
                <div className="project-detail-newborn-content">
                  <div className="project-detail-newborn-text-group">
                    <p className="project-detail-newborn-paragraph">
                      'Newborn Space' is a project that <span>transforms auditory information inherent in physical space into visual space using artificial intelligence.</span> The AI, trained on 360-degree audiovisual data collected from various locations, identifies the correlation between sound and image, generating virtual space based on input sound. The space generated in this way is delivered to the audience through various media, forming a <span>fluid landscape</span> that constantly changes in reaction to ambient sound.
                    </p>
                    <p className="project-detail-newborn-paragraph">
                      The project performs systematic version control based on data collection methods, model structures, and input audio characteristics. Each version number represents: <span>Major (structural transitions), Minor (gradual improvements), and Patch (detailed modifications).</span> As data accumulates and the model improves through repetitive learning, a more concrete form of 'Newborn Space' is being realized, and <span>each version clearly records this process of technological evolution.</span>
                    </p>
                  </div>
                  <div className="project-detail-newborn-versions-wrapper">
                    <div className="project-detail-newborn-version-item">
                      <div className="project-detail-newborn-version-year">2023</div>
                      <h3 className="project-detail-newborn-version">Version 1.x</h3>
                      <div className="project-detail-newborn-version-details">
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">Data Collection</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>4x Action Cameras (Panoramic Setup)</li>
                            <li>Ambisonic Audio Recorder</li>
                          </ul>
                        </div>
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">AI Model</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>Base : pix2pix</li>
                            <li>Dataset : Small Scale</li>
                          </ul>
                        </div>
                      </div>
                      <p className="project-detail-newborn-version-description">
                        As the project's initial iteration, audiovisual data was collected using four action cameras arranged in a panoramic configuration alongside an ambisonic spatial audio recorder. By training a pix2pix-based model on a limited dataset, this stage experimented with the feasibility of sound-to-image translation.
                      </p>
                    </div>
                    <div className="project-detail-newborn-version-item">
                      <div className="project-detail-newborn-version-year">2024</div>
                      <h3 className="project-detail-newborn-version">Version 2.0.x</h3>
                      <div className="project-detail-newborn-version-details">
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">Data Collection</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>360° Camera</li>
                            <li>Ambisonic Audio Recorder</li>
                          </ul>
                        </div>
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">AI Model</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>Base : pix2pix</li>
                            <li>Dataset : Expanded</li>
                          </ul>
                        </div>
                      </div>
                      <p className="project-detail-newborn-version-description">
                        The utilization of a 360-degree camera enabled the acquisition of spatial data where image and sound are more seamlessly integrated. This version leveraged a significantly expanded dataset for training compared to the previous iteration.
                      </p>
                    </div>
                    <div className="project-detail-newborn-version-item project-detail-newborn-version-item-active">
                      <div className="project-detail-newborn-version-year">2025 - Now</div>
                      <h3 className="project-detail-newborn-version">Version 2.1.x</h3>
                      <div className="project-detail-newborn-version-details">
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">Data Collection</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>360° Camera</li>
                            <li>Ambisonic Audio Recorder</li>
                          </ul>
                        </div>
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">AI Model</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>Base : Modified pix2pix</li>
                            <li>Dataset : Expanded</li>
                          </ul>
                        </div>
                      </div>
                      <p className="project-detail-newborn-version-description">
                        The pix2pix model was adapted to be optimized for training on 360-degree Equirectangular Images, accompanied by a fundamental restructuring of the input data format. By converting audio Mel Spectrograms into the equirectangular format for training, this version establishes a methodology that directly maps the auditory characteristics of sound onto spatial information.
                      </p>
                    </div>
                    <div className="project-detail-newborn-version-item">
                      <div className="project-detail-newborn-version-year">In Development</div>
                      <h3 className="project-detail-newborn-version">Version 3.x</h3>
                      <div className="project-detail-newborn-version-details">
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">Focus</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>Spatial Dimensionality</li>
                          </ul>
                        </div>
                        <div className="project-detail-newborn-version-column">
                          <h4 className="project-detail-newborn-version-label">Approach</h4>
                          <ul className="project-detail-newborn-version-list">
                            <li>3D Scanning & 2D to 3D Conversion</li>
                          </ul>
                        </div>
                      </div>
                      <p className="project-detail-newborn-version-description">
                        Focusing on spatial dimensionalization as a core objective, future research will explore methods to convey the sound-generated 'Newborn Space' with three-dimensional depth and volumetric presence.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <section className="project-detail-newborn-section">
              <h2 className="project-detail-newborn-title">CURRENT WORKFLOW</h2>
              <div className="project-detail-newborn-content">
                {/* 텍스트 내용은 추후 추가 */}
              </div>
            </section>
            <section className="project-detail-newborn-section">
              <h2 className="project-detail-newborn-title">ARTWORKS</h2>
              <div className="project-detail-newborn-content">
                {/* 텍스트 내용은 추후 추가 */}
              </div>
            </section>
          </div>
        )}

        {/* Section 01: Data Collection */}
        {sections.section01 && (
          <section className="project-detail-section">
            <div className="project-detail-section-num">01</div>
            <div className="project-detail-section-content">
              <div className="project-detail-tags">
                {sections.section01.tags.map((tag, idx) => (
                  <span key={idx} className="project-detail-tag">{tag}</span>
                ))}
              </div>
              <h2 className="project-detail-section-title">{sections.section01.title}</h2>
              
              <div className="project-detail-map-wrapper">
                <div className="project-detail-map-bg">MAP INTERFACE (Mapbox API Area)</div>
                
                {sections.section01.mapPins && sections.section01.mapPins.map((pin, idx) => (
                  <div 
                    key={idx}
                    className="project-detail-data-pin" 
                    style={{ top: pin.top, left: pin.left }}
                    onClick={() => openPin(pin.title, pin.coord)}
                  ></div>
                ))}

                {pinModal.open && (
                  <div className="project-detail-pin-modal">
                    <h3>{pinModal.title}</h3>
                    <p className="project-detail-coord">{pinModal.coord}</p>
                    <div className="project-detail-video-placeholder">
                      ▶ Playing YouTube ASMR Video...<br />
                      (Ambisonics 360 Audio)
                    </div>
                    <button 
                      className="project-detail-modal-close"
                      onClick={closePin}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              {sections.section01.note && (
                <p className="project-detail-mono project-detail-note">
                  {sections.section01.note}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Section 02: Preprocessing */}
        {sections.section02 && (
          <section className="project-detail-section">
            <div className="project-detail-section-num">02</div>
            <div className="project-detail-section-content">
              <div className="project-detail-tags">
                {sections.section02.tags.map((tag, idx) => (
                  <span key={idx} className="project-detail-tag">{tag}</span>
                ))}
              </div>
              <h2 className="project-detail-section-title">{sections.section02.title}</h2>
              {sections.section02.description && (
                <p className="project-detail-section-description">
                  {sections.section02.description}
                </p>
              )}

              <div className="project-detail-process-grid">
                <div className="project-detail-process-box">
                  <h3>{sections.section02.inputTitle}</h3>
                  <p className="project-detail-mono">{sections.section02.inputSubtitle}</p>
                  <svg width="100%" height="80" style={{ marginTop: '20px' }}>
                    <path d="M0,40 Q20,10 40,40 T80,40 T120,40 T160,40" stroke="#444" fill="none" strokeWidth="2"/>
                    <path d="M0,40 Q10,70 20,40 T40,40 T60,40 T80,40" stroke="#00ff88" fill="none" strokeWidth="2"/>
                  </svg>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                    {sections.section02.inputDescription}
                  </p>
                </div>

                <div className="project-detail-process-box">
                  <h3>{sections.section02.outputTitle}</h3>
                  <p className="project-detail-mono">{sections.section02.outputSubtitle}</p>
                  
                  <div className="project-detail-tensor-visualizer">
                    {Array.from({ length: 12 }).map((_, idx) => (
                      <div key={idx} className="project-detail-tensor-cell"></div>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '10px' }}>
                    {sections.section02.outputDescription}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 03: Architecture */}
        {sections.section03 && (
          <section className="project-detail-section">
            <div className="project-detail-section-num">03</div>
            <div className="project-detail-section-content">
              <div className="project-detail-tags">
                {sections.section03.tags.map((tag, idx) => (
                  <span key={idx} className="project-detail-tag">{tag}</span>
                ))}
              </div>
              <h2 className="project-detail-section-title">{sections.section03.title}</h2>
              
              {sections.section03.code && (
                <div className="project-detail-code-window">
                  {sections.section03.code.split('\n').map((line, idx) => {
                    // 키워드와 클래스명, 주석을 찾아서 하이라이팅
                    const parts = [];
                    let remaining = line;
                    
                    // 키워드 매칭 (class, def, if, return, self)
                    const keywordRegex = /\b(class|def|if|return|self)\b/;
                    const keywordMatch = remaining.match(keywordRegex);
                    if (keywordMatch) {
                      const before = remaining.substring(0, keywordMatch.index);
                      if (before) parts.push({ type: 'text', content: before });
                      parts.push({ type: 'kwd', content: keywordMatch[0] });
                      remaining = remaining.substring(keywordMatch.index + keywordMatch[0].length);
                    }
                    
                    // 클래스명 매칭
                    const classRegex = /\b(SphereConv2d|CircularPad2d|nn\.Module)\b/;
                    const classMatch = remaining.match(classRegex);
                    if (classMatch) {
                      const before = remaining.substring(0, classMatch.index);
                      if (before) parts.push({ type: 'text', content: before });
                      parts.push({ type: 'cls', content: classMatch[0] });
                      remaining = remaining.substring(classMatch.index + classMatch[0].length);
                    }
                    
                    // 주석 매칭
                    const commentIndex = remaining.indexOf('#');
                    if (commentIndex >= 0) {
                      if (commentIndex > 0) parts.push({ type: 'text', content: remaining.substring(0, commentIndex) });
                      parts.push({ type: 'com', content: remaining.substring(commentIndex) });
                    } else if (remaining) {
                      parts.push({ type: 'text', content: remaining });
                    }
                    
                    return (
                      <div key={idx}>
                        {parts.length > 0 ? (
                          parts.map((part, partIdx) => {
                            if (part.type === 'kwd') {
                              return <span key={partIdx} className="project-detail-code-kwd">{part.content}</span>;
                            } else if (part.type === 'cls') {
                              return <span key={partIdx} className="project-detail-code-cls">{part.content}</span>;
                            } else if (part.type === 'com') {
                              return <span key={partIdx} className="project-detail-code-com">{part.content}</span>;
                            } else {
                              return <span key={partIdx}>{part.content}</span>;
                            }
                          })
                        ) : (
                          <span>{line}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 04: Result */}
        {sections.section04 && (
          <section className="project-detail-section" style={{ borderBottom: 'none' }}>
            <div className="project-detail-section-num">04</div>
            <div className="project-detail-section-content">
              <div className="project-detail-tags">
                {sections.section04.tags.map((tag, idx) => (
                  <span key={idx} className="project-detail-tag">{tag}</span>
                ))}
              </div>
              <h2 className="project-detail-section-title">{sections.section04.title}</h2>
              {sections.section04.description && (
                <p className="project-detail-section-description">
                  {sections.section04.description}
                </p>
              )}

              <div 
                className="project-detail-slider-wrapper" 
                id="project-slider"
                onMouseDown={handleMouseDown}
                style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
              >
                <div className="project-detail-slide-image project-detail-img-before">
                  {sections.section04.beforeLabel && (
                    <div className="project-detail-slider-label project-detail-slider-label-before">
                      {sections.section04.beforeLabel}
                    </div>
                  )}
                </div>
                <div 
                  className="project-detail-slide-image project-detail-img-after"
                  style={{ width: `${sliderPosition}%` }}
                >
                  {sections.section04.afterLabel && (
                    <div className="project-detail-slider-label project-detail-slider-label-after">
                      {sections.section04.afterLabel}
                    </div>
                  )}
                </div>
                
                <div 
                  className="project-detail-slider-knob"
                  style={{ left: `${sliderPosition}%` }}
                >
                  &lt; &gt;
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        {footer && (
          <footer className="project-detail-footer">
            <div className="project-detail-footer-content">
              <h3 className="project-detail-mono">{footer.office}</h3>
              <p className="project-detail-footer-text">
                {footer.text.split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < footer.text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          </footer>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const slugs = getAllProjectSlugs();
  
  return {
    paths: slugs.map(slug => ({
      params: { slug }
    })),
    fallback: false // 정적 데이터만 사용하므로 false
  };
}

export async function getStaticProps({ params }) {
  const project = getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      project,
      slug: params.slug
    }
  };
}
