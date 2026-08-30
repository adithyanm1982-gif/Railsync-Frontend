export interface HitTarget {
  id: string;
  type: 'train' | 'maintenance-block';
  screenX: number;
  screenY: number;
  radius: number;
}

/**
 * Circular hit-testing against the last-rendered-frame's target list
 * (populated each frame by TrainRenderer / MaintenanceBlockRenderer).
 * RenderEngine's mousemove handler calls findHit() to decide which
 * popover to show.
 */
export class HoverDetection {
  private targets: HitTarget[] = [];

  setFrameTargets(targets: HitTarget[]) {
    this.targets = targets;
  }

  findHit(screenX: number, screenY: number): HitTarget | null {
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const t = this.targets[i];
      const dx = screenX - t.screenX;
      const dy = screenY - t.screenY;
      if (Math.sqrt(dx * dx + dy * dy) <= t.radius) return t;
    }
    return null;
  }
}
