/**
 * Created by Alexander I. Petrusenko on 05.08.2015.
 */

(function () {
    ko.bindingHandlers['grid'] = function () {
        return {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var childBindingContext = bindingContext.createChildContext(valueAccessor());
                ko.applyBindingsToDescendants(childBindingContext, element);

                // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
                return {controlsDescendantBindings: true};
            }
        };
    }();
    ko.bindingHandlers['grid.pager'] = {
        init: function (element, valueAccessor) {
            var pager = ko.unwrap(valueAccessor());
            var cachedPagesState;
            var initPages = function () {
                var pagesCount = pager.pages();
                if (cachedPagesState === pagesCount)
                    return;
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                if (pagesCount > 1) {
                    for (var i = 0; i < pagesCount; i++) {
                        var button = document.createElement('button');
                        button.setAttribute('class', 'grid-pager-pageButton');
                        button.innerHTML = '' + (i + 1);
                        element.appendChild(button);
                        button.onclick = function (pageIndex) {
                            return function () {
                                pager.changePage(pageIndex)
                            };
                        }(i);
                    }
                }
                var toggleButton = document.createElement('button');
                toggleButton.setAttribute('class', 'grid-pager-toggleButton');
                toggleButton.innerHTML = pagesCount > 1 ? 'Show all' : 'Show pages';
                element.appendChild(toggleButton);
                toggleButton.onclick = pager.togglePages;
                cachedPagesState = pager.pages();
            };
            pager.pages.subscribe(initPages);
            initPages();

            return {controlsDescendantBindings: true};
        }
    };
    ko.bindingHandlers['grid.sort'] = {
        init: function (element, valueAccessor) {
            var sortOptions = {
                method: ko.grid.sort.alphabetic
            };
            ko.utils.extend(sortOptions, valueAccessor());

            var startDirection = ko.observable(0);
            var chainDirection = ko.observable(0);
            var directionClassRegex = /grid-sort-(?:neutral|up|down)/i;
            var directionClassChangeFunction = function (element, directionObservable) {
                return function () {
                    var classes = element.getAttribute('class');
                    var directionClass;
                    switch (directionObservable()) {
                        case 0:
                            directionClass = 'grid-sort-neutral';
                            break;
                        case 1:
                            directionClass = 'grid-sort-up';
                            break;
                        case -1:
                            directionClass = 'grid-sort-down';
                            break;
                    }
                    classes = classes.replace(directionClassRegex, directionClass);
                    element.setAttribute('class', classes);
                };
            };

            var div = document.createElement('div');
            element.appendChild(div);
            var textSpan = document.createElement('span');
            textSpan.innerHTML = sortOptions.text;
            div.appendChild(textSpan);

            // Start sort button
            var startSortButton = document.createElement('span');
            startSortButton.setAttribute('class', 'grid-sort-start grid-sort-neutral');
            startDirection.subscribe(directionClassChangeFunction(startSortButton, startDirection));
            var startSortButtonClickAccessor = function (event) {
                if (startDirection() !== 1)
                    startDirection(1);
                else
                    startDirection(-1);
                var entry = {
                    method: sortOptions.method,
                    field: sortOptions.field,
                    direction: startDirection(),
                    element: element
                };
                sortOptions.grid.sortChain.removeAll();
                sortOptions.grid.sortChain.push(entry);
                event.stopPropagation();
            };
            div.appendChild(startSortButton);
            startSortButton.onclick = startSortButtonClickAccessor;
            element.onclick = startSortButtonClickAccessor;

            // Chain sort button
            var chainIndex = ko.observable(-1);
            var chainSortButton = document.createElement('span');
            chainSortButton.setAttribute('class', 'grid-sort-chain grid-sort-neutral');
            chainIndex.subscribe(directionClassChangeFunction(chainSortButton, chainDirection, true));
            chainDirection.subscribe(directionClassChangeFunction(chainSortButton, chainDirection, true));
            chainDirection.valueHasMutated();
            var chainSortButtonClickAccessor = function (event) {
                var currentDirection = chainDirection();
                if (currentDirection == 0)
                    chainDirection(1);
                else if (currentDirection == 1)
                    chainDirection(-1);
                else
                    chainDirection(0);
                var entry = {
                    method: sortOptions.method,
                    field: sortOptions.field,
                    direction: chainDirection(),
                    element: element
                };
                var found = false;
                var sortChain = sortOptions.grid.sortChain();
                for (var i = 0; i < sortChain.length; i++) {
                    if (sortChain[i].element === element) {
                        if (chainDirection() !== 0)
                            sortOptions.grid.sortChain.replace(sortChain[i], entry);
                        else
                            sortOptions.grid.sortChain.splice(i, 1);
                        chainIndex(i);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    chainIndex(sortChain.length);
                    sortOptions.grid.sortChain.push(entry);
                }
                event.stopPropagation();
            };
            div.appendChild(chainSortButton);
            chainSortButton.onclick = chainSortButtonClickAccessor;

            var onChainUpdate = function () {
                var sortChain = sortOptions.grid.sortChain();
                if (sortChain.length === 0)
                    chainSortButton.setAttribute('disabled', 'disabled');
                if (sortChain.length === 1) {
                    if (sortChain[0].element === element) {
                        chainSortButton.setAttribute('disabled', 'disabled');
                    }
                    else {
                        chainSortButton.removeAttribute('disabled');
                        startDirection(0);
                    }
                }
                var found = false;
                for (var i = 1; i < sortChain.length; i++) {
                    if (sortChain[i].element === element) {
                        chainIndex(i);
                        chainSortButton.removeAttribute('disabled');
                        found = true;
                        break;
                    }
                }
                if (!found)
                    chainDirection(0);
            };
            sortOptions.grid.sortChain.subscribe(onChainUpdate);
            onChainUpdate();

            return {controlsDescendantBindings: true};
        }
    };
    ko.grid = function () {

    };
    ko.grid.sort = new function () {
        this.buildSortChain = function (sortMethodsArray) {
            if (!sortMethodsArray || sortMethodsArray.length < 1)
                return function () {
                    return 0;
                };
            var entry = sortMethodsArray[sortMethodsArray.length - 1];
            if (entry.direction === null || entry.direction === undefined)
                entry.direction = 1;
            var chain;
            if (typeof entry.method === 'string')
                chain = this[entry.method](entry.field, entry.direction);
            else
                chain = entry.method(entry.field, entry.direction);
            for (var i = sortMethodsArray.length - 2; i >= 0; i--) {
                entry = sortMethodsArray[i];
                if (entry.direction === null || entry.direction === undefined)
                    entry.direction = 1;
                if (typeof entry.method === 'string')
                    chain = this[entry.method](entry.field, entry.direction, chain);
                else
                    chain = entry.method(entry.field, entry.direction, chain);
            }
            return chain;
        };
        this.alphabetic = function (field, direction, sortChain) {
            return function (a, b) {
                var diff = direction * a[field].toLowerCase().localeCompare(b[field].toLowerCase());
                if (diff === 0 && sortChain)
                    diff = sortChain(a, b);
                return diff;
            };
        };
        //noinspection JSUnusedGlobalSymbols
        this.alphabeticCaseSensitive = function (field, direction, sortChain) {
            return function (a, b) {
                var diff;
                if (a[field] === b[field])
                    diff = 0;
                else if (a[field] > b[field])
                    diff = direction;
                else
                    diff = -1 * direction;
                if (diff === 0 && sortChain)
                    diff = sortChain(a, b);
                return diff;
            };
        };
        this.numeric = function (field, direction, sortChain) {
            return function (a, b) {
                var diff = direction * (a[field] - b[field]);
                if (diff === 0 && sortChain)
                    diff = sortChain(a, b);
                return diff;
            };
        };
    }();
    ko.grid.create = function (gridOptions) {
        var defaultGridOptions = {
            rows: []
        };
        ko.utils.extend(defaultGridOptions, gridOptions);

        // Main grid section
        var currentPage = ko.observable(0);
        var showAll = ko.observable(!defaultGridOptions.pager);
        var maxPage = ko.pureComputed(function () {
            var array = ko.unwrap(defaultGridOptions.rows);
            if (array.length === 0 || !defaultGridOptions.pager)
                return 0;
            return Math.ceil(array.length / rowsPerPage()) - 1;
        });
        var currentRowsObservable = ko.pureComputed(function () {
            sort();
            ko.unwrap(sortHandler);
            var array = ko.unwrap(defaultGridOptions.rows);
            if (!defaultGridOptions.pager || showAll())
                return array;
            var rpp = rowsPerPage();
            if (rpp > array.length)
                return array;
            var cur = currentPage();
            var startIndex = cur * rpp;
            var endIndex = Math.min(startIndex + rpp, array.length);
            if (endIndex === array.length) {
                var maxPageIndex = maxPage();
                currentPage(maxPageIndex);
                startIndex = maxPageIndex * rpp;
            }
            return array.slice(startIndex, endIndex);
        });

        // Pager
        var rowsPerPage;
        var pager;
        if (defaultGridOptions.pager) {
            rowsPerPage = ko.observable(defaultGridOptions.pager.rowsPerPage);
            var prevPageAvailable = ko.pureComputed(function () {
                return currentPage() > 0;
            });
            var nextPageAvailable = ko.pureComputed(function () {
                return currentPage() < maxPage();
            });
            pager = function () {
                //noinspection JSUnusedGlobalSymbols
                return {
                    rowsPerPage: rowsPerPage,
                    currentPage: currentPage,
                    changePage: function (pageIndex) {
                        if (pageIndex === null || pageIndex === undefined)
                            return;
                        var maxPageIndex = maxPage();
                        if (pageIndex > maxPageIndex)
                            currentPage(maxPageIndex);
                        else if (pageIndex < 0)
                            currentPage(0);
                        else
                            currentPage(pageIndex);
                    },
                    prevPageAvailable: prevPageAvailable,
                    prevPage: function () {
                        var newIndex = currentPage() - 1;
                        if (prevPageAvailable())
                            currentPage(newIndex);
                        else
                            currentPage(0);
                    },
                    nextPageAvailable: nextPageAvailable,
                    nextPage: function () {
                        currentPage(currentPage() + 1);
                    },
                    pages: ko.pureComputed(function () {
                        if (showAll())
                            return 0;
                        return maxPage() + 1;
                    }),
                    togglePages: function () {
                        showAll(!showAll());
                    },
                    showAllCaption: defaultGridOptions.pager.showAllCaption != null && defaultGridOptions.pager.showAllCaption != undefined ? defaultGridOptions.pager.showAllCaption : 'Show All',
                    showPagesCaption: defaultGridOptions.pager.showPagesCaption != null && defaultGridOptions.pager.showPagesCaption != undefined ? defaultGridOptions.pager.showPagesCaption : 'Show pages'
                }
            }();
        }

        var sortHandler = ko.observable(null);
        var sortChain = ko.observableArray([]);
        var sort = function () {
            var chain = ko.grid.sort.buildSortChain(sortChain());
            defaultGridOptions.rows.sort(chain);
        };
        sortChain.subscribe(function () {
            sort();
            sortHandler.valueHasMutated();
        });

        return {
            allRows: defaultGridOptions.rows,
            rows: currentRowsObservable,
            pager: pager,
            sortChain: sortChain,
            sort: ko.grid.sort
        };
    };
})();