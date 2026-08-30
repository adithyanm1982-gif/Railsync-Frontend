import { TOTAL_TIMELINE_SECONDS, SECONDS_PER_DAY } from './simCalendar';

export type SpeedMultiplier = 1 | 2 | 5 | 10 | 30 | 60 | 180;

/**
 * Drives the master clock across the real 7-day window. Absolute
 * seconds run 0 (start of 2026-08-27) .. TOTAL_TIMELINE_SECONDS (end
 * of 2026-09-02), wrapping at the ends. Supports free jump-to-any-day
 * in addition to continuous play/pause/speed, per the "check any day
 * at will" requirement. Framework-agnostic so it can run inside the
 * imperative render loop without React re-render overhead.
 */
export class TimelineClock {
  private _absoluteSeconds = 0;
  private _isPlaying = false;
  private _speed: SpeedMultiplier = 10;

  get absoluteSeconds() {
    return this._absoluteSeconds;
  }

  get isPlaying() {
    return this._isPlaying;
  }

  get speed() {
    return this._speed;
  }

  play() {
    this._isPlaying = true;
  }

  pause() {
    this._isPlaying = false;
  }

  setSpeed(multiplier: SpeedMultiplier) {
    this._speed = multiplier;
  }

  seekToAbsolute(seconds: number) {
    this._absoluteSeconds = this.wrap(seconds);
  }

  /** Free-will day jump: go straight to 00:00 of the given day index (0-6). */
  jumpToDay(dayIndex: number) {
    this._absoluteSeconds = this.wrap(dayIndex * SECONDS_PER_DAY);
  }

  stepForward(seconds = 300) {
    this._absoluteSeconds = this.wrap(this._absoluteSeconds + seconds);
  }

  stepBackward(seconds = 300) {
    this._absoluteSeconds = this.wrap(this._absoluteSeconds - seconds);
  }

  tick(deltaMs: number) {
    if (!this._isPlaying) return;
    const deltaSeconds = (deltaMs / 1000) * this._speed;
    this._absoluteSeconds = this.wrap(this._absoluteSeconds + deltaSeconds);
  }

  private wrap(seconds: number): number {
    return ((seconds % TOTAL_TIMELINE_SECONDS) + TOTAL_TIMELINE_SECONDS) % TOTAL_TIMELINE_SECONDS;
  }
}
