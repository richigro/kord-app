import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faPlay,
  faPauseCircle,
  faVolumeMute,
  faVolumeDown,
  faVolumeUp
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import React from "react";

import { ReactComponent as BackwardIcon } from "../assets/backward.svg";
import { ReactComponent as ForwardIcon } from "../assets/forward.svg";
import { ReactComponent as PauseIcon } from "../assets/pause-button.svg";
import { ReactComponent as PlayIcon } from "../assets/play-button.svg";
import { formatArtistName } from "../utils/formatArtistName";
import { getImgUrl } from "../utils/getImgUrl";
import { nextTrack, prevTrack } from "../redux/actions/playerActions";
import { useMobileDetection } from "../utils/hooks";
import placeholderImg from "../assets/track-placeholder.jpg";
import progressBarStyles from "../styles/progressBar.module.css";
import secondsToFormatted from "../utils/secondsToFormatted";
import styles from "../styles/player.module.css";

const MinifiedPlayer = ({
  current,
  handleToggleExpand,
  handlePlayPause,
  isPlaying,
  isUserSeeking,
  userSeekPos,
  seek,
  volume,
  duration,
  handleOnChangeUserSeek,
  handleMouseDownSeek,
  handleMouseUpSeek,
  isUserSettingVolume,
  userVolumeValue,
  handleOnChangeVolume,
  handleMouseDownVolume,
  handleMouseUpVolume
}) => {
  const isMobile = useMobileDetection();
  const dispatch = useDispatch();

  const progress = (isUserSeeking ? userSeekPos : seek) / duration;
  const progressPercent = `${progress * 100}%`;

  const currentVolumeValue = Number(
    isUserSettingVolume ? userVolumeValue : volume
  );
  const sliderWidth = 125; // px

  const volumeWidth = currentVolumeValue * sliderWidth;
  const volumeRight = sliderWidth - volumeWidth;

  const volumeIcon =
    currentVolumeValue === 0
      ? faVolumeMute
      : currentVolumeValue < 0.5
      ? faVolumeDown
      : faVolumeUp;
  return (
    <div className={styles.playerAndSeekContainer}>
      <div className={progressBarStyles.progressContainer}>
        <input
          className={progressBarStyles.desktopSeekBar}
          type="range"
          min="0"
          max={duration}
          step="any"
          value={isUserSeeking ? userSeekPos : seek}
          onChange={handleOnChangeUserSeek}
          onMouseDown={handleMouseDownSeek}
          onMouseUp={handleMouseUpSeek}
        />
        <span
          className={progressBarStyles.progressBar}
          style={{ width: progressPercent }}
        ></span>
      </div>
      <div
        className={`${styles.playerWrapper} ${styles.miniPlayer} ${progressBarStyles.playerWrapper}`}
        tabIndex={isMobile ? 0 : null}
        role="button"
        onClick={isMobile ? handleToggleExpand : null}
      >
        <button
          type="button"
          onClick={handleToggleExpand}
          className={styles.miniPlayerExpandButton}
        >
          <FontAwesomeIcon icon={faAngleUp} />
        </button>
        <div className={styles.nowPlaying}>
          <div className={styles.miniPlayerImageWrap}>
            <img
              src={current.img ? getImgUrl(current, "md") : placeholderImg}
              alt="album-art"
            />
          </div>
          <div className={styles.titleWrapper}>
            <div className={styles.nowPlayingTitle}>{current.title}</div>
            <div className={styles.nowPlayingArtist}>
              {formatArtistName(current.artist)}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePlayPause}
          className={styles.miniPlayerPlayButton}
        >
          <FontAwesomeIcon icon={isPlaying ? faPauseCircle : faPlay} />
        </button>
        <div className={styles.desktopButtonGroup}>
          <span className={progressBarStyles.timeContainer}>
            {secondsToFormatted(isUserSeeking ? userSeekPos : seek || 0)}
          </span>
          <button
            type="button"
            className={styles.backwardButton}
            onClick={() => dispatch(prevTrack())}
          >
            <BackwardIcon />
          </button>
          <button
            type="button"
            className={styles.desktopPlayPauseButton}
            onClick={handlePlayPause}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className={styles.forwardButton}
            onClick={() => dispatch(nextTrack())}
          >
            <ForwardIcon />
          </button>
          <span className={progressBarStyles.timeContainer}>
            {secondsToFormatted(duration || 0)}
          </span>
        </div>

        <div className={styles.volumeWrapper}>
          <span className={styles.volumeIconWrapper}>
            <FontAwesomeIcon icon={volumeIcon} size="sm" />
          </span>
          <span
            className={styles.volumeLowerFill}
            style={{ width: volumeWidth, right: volumeRight }}
          ></span>
          <input
            type="range"
            className={styles.volumeSlider}
            value={isUserSettingVolume ? userVolumeValue : volume}
            min="0"
            max="1"
            step="0.05"
            onChange={handleOnChangeVolume}
            onMouseDown={handleMouseDownVolume}
            onMouseUp={handleMouseUpVolume}
          />
        </div>
      </div>
    </div>
  );
};

MinifiedPlayer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  current: PropTypes.object.isRequired,
  handleToggleExpand: PropTypes.func.isRequired,
  handlePlayPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired
};

export default MinifiedPlayer;
