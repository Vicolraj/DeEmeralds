declare module '*.css';
declare module 'swiper/css';
declare module 'swiper/css/pagination';
// Allow importing css files (including swiper css) in TypeScript
declare module '*.css';

// CSS module paths used by swiper
declare module 'swiper/css';
declare module 'swiper/css/pagination';

// Provide minimal typings for swiper modules and react adapter to avoid TS resolution issues
declare module 'swiper' {
	// named JS modules exported by the package
	export const Autoplay: any;
	export const Pagination: any;
	export const Navigation: any;
	export const A11y: any;
	const _default: any;
	export default _default;
}

declare module 'swiper/react' {
	import * as React from 'react';
	export const Swiper: React.ComponentType<any>;
	export const SwiperSlide: React.ComponentType<any>;
	const _default: any;
	export default _default;
}

// Fallback for internal module paths like 'swiper/modules/autoplay'
declare module 'swiper/modules/*' {
	const m: any;
	export default m;
}
