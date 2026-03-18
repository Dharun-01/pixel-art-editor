import React from 'react';
import Footer from './components/footer';
import MiddleSection from './components/middleSection';
import Header from './components/header';
export default function HomePage() {
	return (
		<>
			<div className='flex selection:bg-custom-black  bg-home-bg flex-col min-h-screen min-w-screen'>
				<Header />
				<MiddleSection />
				<Footer />
			</div>
		</>
	);
}
