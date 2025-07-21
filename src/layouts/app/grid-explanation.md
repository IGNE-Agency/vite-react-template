Quick inline explanation of how the grid system works. 
In separate file as not to pollute the scss file.

Mobile first grid layout.

```scss
.layout {
  // By default (small screens) center content until it is 500px wide.
  // Divide remaining space by two, for a gutter on both sides.
	--gutter: calc((100cqi - 500px) / 2);
	display: grid;
	// Space for header & main, and (optionally) sticky footer.
  // Use the short-hand that fits best. Usually `min-content` or `auto`.
	grid-template-rows: min-content 1fr;
	// If you have different page layouts, you can choose to make multiple layouts
	// to name the grid lines. _This is optional, as you can also use the numbered grid columns._
	// Here we create the grid-area `main` by naming two grid lines with the suffix -start & end.
	grid-template-columns:
		var(--gutter)
		[main-start]
		repeat(4, 1fr)
		[main-end]
		var(--gutter);
	gap: var(--unit-4);
	width: 100cqi;
	min-height: 100cqb;

	@media (min-width: 992px) {
		// large screens: center after 1440px
		--gutter: calc((100cqi - 1440px) / 2);
		grid-template-columns:
			var(--gutter)
			[main-start]
			repeat(12, 1fr)
			[main-end]
			var(--gutter);
	}

	// Direct descendants are automatically plotted at full width
	// and "copy" the grid-template-columns, so inside they will perfecly align.
	// eg: header, main, footer
	& > * {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
	}
}

// This can be used anywhere to pass the grid columns down.
// Update if you change the named lines in grid-template-columns
.gridMain {
	display: grid;
	grid-template-columns: subgrid;
	grid-column: main; // same as: 2 / -2
}
```
