import { formatDollars } from '../utils';

// TODO 162: Have a markup.js file, consolidate these other files
export function earningsDisplay(earnings) {
  const bclass = earnings >= 0 ? 'success' : 'danger';
  return `<div class='center_container'>
    <h1 class='text-${bclass}'>${formatDollars(earnings)}</h1>
    </div>`;
}
