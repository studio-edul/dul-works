import { useRef, useEffect } from 'react';

export default function SideMenu({ options, currentView, onViewChange }) {
    const menuRef = useRef(null);
    // 애니메이션 상태를 위한 ref (리렌더링 방지)
    const state = useRef({
        currentY: 0,
        targetY: 0,
    });

    useEffect(() => {
        // 초기 위치 설정
        if (typeof window !== 'undefined') {
            state.current.currentY = window.scrollY + window.innerHeight / 2;
            state.current.targetY = window.scrollY + window.innerHeight / 2;
        }

        let rafId;

        const handleScroll = () => {
            // 목표 위치: 현재 스크롤 위치 + 화면 높이의 절반
            state.current.targetY = window.scrollY + window.innerHeight / 2;
        };

        const animate = () => {
            const { currentY, targetY } = state.current;

            // Lerp (Linear Interpolation) 적용: 현재 위치를 목표 위치로 부드럽게 이동
            // 0.1은 감속 계수 (작을수록 느리게 따라감)
            const ease = 0.15;
            const nextY = currentY + (targetY - currentY) * ease;

            state.current.currentY = nextY;

            if (menuRef.current) {
                // transform을 사용하여 GPU 가속 활용
                // -50%는 CSS의 -translate-y-1/2에 해당 (요소 중심점 보정)
                menuRef.current.style.transform = `translateY(calc(-50% + ${nextY}px))`;
            }

            rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll); // 리사이즈 시에도 위치 재계산

        // 애니메이션 루프 시작
        animate();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <aside ref={menuRef} className="side-menu">
            {options.map((option) => (
                <button
                    key={option.id}
                    className={`side-menu-item ${currentView === option.id ? 'active' : ''}`}
                    onClick={() => onViewChange(option.id)}
                >
                    {option.label}
                </button>
            ))}
        </aside>
    );
}
