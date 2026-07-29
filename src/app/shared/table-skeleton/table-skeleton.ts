import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
  selector: 'app-table-skeleton',
  imports: [HlmSkeletonImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-3 p-4">
      @for (row of rowsArray(); track $index) {
        <div class="flex items-center gap-4">
          @for (col of colsArray(); track $index) {
            <hlm-skeleton class="h-4 flex-1" />
          }
        </div>
      }
    </div>
  `,
})
export class TableSkeleton {
  readonly rows = input(5);
  readonly cols = input(5);

  protected rowsArray(): number[] {
    return Array.from({ length: this.rows() });
  }

  protected colsArray(): number[] {
    return Array.from({ length: this.cols() });
  }
}
