import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthorInfo from './AuthorInfo.js';
import filters from '../util/filters.js';
import config from '../util/config.js';
import './DiscordMessage.css';

export default class DiscordMessage extends Component {
	static propTypes = {
		author: PropTypes.string,
		avatar: PropTypes.string,
		bot: PropTypes.bool,
		edited: PropTypes.bool,
		roleColor: PropTypes.string,
		timestamp: PropTypes.oneOfType([
			PropTypes.instanceOf(Date),
			PropTypes.string,
		]),
		user: PropTypes.string,
	};

	static defaultProps = {
		author: 'User',
	};

	createProfile() {
		const { props } = this;

		const resolveAvatar = avatar => config.avatars[avatar] || avatar || config.avatars.default;
		const defaults = {
			author: props.author,
			bot: props.bot,
			roleColor: props.roleColor,
		};

		const profile = config.profiles[props.user] || {};
		profile.avatar = resolveAvatar(profile.avatar || props.avatar);

		return Object.assign(defaults, profile);
	}

	renderTimestamp() {
		const timestamp = this.props.timestamp || new Date();
		const { formatDate, padZeroes } = filters.dates;
		return padZeroes(formatDate(timestamp));
	}

	render() {
		const profile = this.createProfile();

		const authorInfo = {
			comfy: (
				<div>
					<AuthorInfo bot={profile.bot} roleColor={profile.roleColor}>
						{profile.author}
					</AuthorInfo>
					<span className="discord-message-timestamp">
						{this.renderTimestamp()}
					</span>
				</div>
			),
			compact: (
				<AuthorInfo bot={profile.bot} roleColor={profile.roleColor}>
					{profile.author}
				</AuthorInfo>
			),
		};

		const { children, compactMode, edited } = this.props;

		return (
			<div className="discord-message">
				<div className="discord-author-avatar">
					<img src={profile.avatar} alt={profile.author} />
				</div>
				<div className="discord-message-content">
					{!compactMode ? authorInfo.comfy : null}
					<div className="discord-message-body">
						{compactMode ? authorInfo.compact : null}
						{children}
						{edited
							? <span className="discord-message-edited">(edited)</span>
							: null
						}
					</div>
				</div>
			</div>
		);
	}
}
