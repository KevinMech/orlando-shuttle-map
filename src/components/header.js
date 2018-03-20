import React from 'react';
import '../App.css';
import FontAwesome from 'react-fontawesome';

const Header = () => {
	return (
		<div className='App-header'>
            <FontAwesome className='App-icon' name='bus' size='1x'/>
			<p>Orlando Shuttle Bus</p>
		</div>
	);
};

export default Header;
