# ko.grid
Grid with support of paging and sorting, using knockout.js

The example is available on JSFiddle: https://jsfiddle.net/iftifn/ug1v8x4h/

This library provides as simple as possible implementation of sortable grid with pager (using knockout.js). Library consists of single ko.grid.js script and ko.grid.css stylesheet. The stylesheet is provided to highlight all elements added dynamically by script, so end user may customize grid to his needs.

##### Key features:
- Sorting
- Pager
- Sorting chain (you can 'sub-sort' by other columns after initial sort is done)

##### Available sorting algorithms:
- alphabetic
- alphabeticCaseSensitive
- numeric

##### Things to come:
- More sorting algorithms, like alphaNumeric
- Better example styling

## Documentation

#### Using ko.grid
```
ko.grid.create = (gridOptions) => return gridViewModel;
```
You should start by creating gridViewModel by calling ***ko.grid.create*** method.

##### gridOptions
```
gridOptions = {
  rows: [] or ko.observableArray(),
  pager: {
    rowsPerPage: number,
    showAllCaption: string,
    showPagesCaption: string
  }
}
```
***rows*** is your main (observable)array.

***pager*** is optional, as well as all it's properties.

##### gridViewModel
```
gridViewModel = {
  rows: ko.observableArray(),
  pager: pagerViewModel,
  sort: sortMethods,
  allRows: [] or ko.observableArray(),
  sortChain: ko.observableArray(sortEntry[])
}
```
***rows*** is always a ko.observableArray(), even if initial array is not. This property is used for bindings, such as **template** or **foreach**.

***allRows*** is initial array, plain or observable.

***sortChain*** is for custom external sort control. Usually, it should not be used.

##### pagerViewModel
```
pagerViewModel = {
  rowsPerPage: ko.observable(number),
  currentPage: ko.observable(number),
  changePage: (pageIndex) => void,
  prevPageAvailable: ko.pureComputed() => boolean,
  prevPage: () => void,
  nextPageAvailable: ko.pureComputed() => boolean,
  nextPage: () => void,
  pages: ko.pureComputed() => number,
  showAllCaption: string,
  showPagesCaption: string
}
```
All properties should be pretty self-explanatory.

You have probably supplied initial ***rowsPerPage*** value, you may update it any time you wish.

***currentPage*** is the index of current page.

***changePage***, ***prevPage*** and ***nextPage*** provide navigation and are intended for **click** binding of custom buttons. ***changePage*** function provides safe way (bounds check) to change ***currentPage***

***prevPageAvailable*** and ***nextPageAvailable*** may be used for **enable** bindings of navigation buttons.

***pages*** returns the number of pages.

##### sortMethods
```
sortMethods = {
  alphabetic,
  alphabeticCaseSensitive,
  numeric,
  ...customSortMethods[]
}
```

Provided sorting methods are self-explanatory. More will be added later, usually by user requests.

Adding custom sort methods will be described later, because this is advanced usage topic.

##### Bindings and usages
You may use **with: gridViewModel** binding on *table* tag. This is optional, but will create binding context and simplify all your nested bindings. All examples next will assume that you have done so. If not, translate $data to apropriate property of your ViewModel.

```
<th data-bind="grid.sort: { grid: $data, method: sort.alphabetic, field: 'first', text: 'alphabetic'}"></th>
```
**grid.sort** binding is probably most complex of all.
- **grid:** should point to your gridViewModel
- **method:** is a sorting method. For simplicity, shortcut to it is under gridViewModel.sort.[methodName]
- **field:** is a string name of property of the initial array entry object. It is used to access values for sorting.
- **text:** binding is currently present because **grid.sort** binding controls descendants. **This will surelly change soon.**
 
```
<span class="page-buttons-container" data-bind="grid.pager: pager"></span>
```
**grid.pager** binding builds default pager, which consists of numbered page buttons and "toggle" button which provides switch between "All" and "Pages" modes. This binding should always be bound to **gridViewModel.pager** object.

You can always build your custom pager View, using **gridViewModel.pager** object. But sometimes CSS customization is enough.

#### CSS customization
All classes in **ko.grid.css** should be self-explanatory. If you doubt, use Firebug or similar to find classes.

All classes in **ko.grid.css** cover and are used only for elements added dynamically by the **ko.grid** library.
