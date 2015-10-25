/**
 * Created by SAns on 06.08.2015.
 */

(function () {
    var RootViewModel = function() {
        var rows = ko.observableArray([]);
        fillArray(rows);
        this.gridOptions = ko.grid.create({
            rows: rows,
            pager: {
                rowsPerPage: 5,
                dynamic: true
            }
        });
        this.check = 'check';
    };
    ko.applyBindings(new RootViewModel());

    function fillArray(array) {
        array.push({ first: 'aaaa', second: 'bbbb', third: 'Marlon	', numeric: '1',  random: 'Um1f62Uefw', random2: 'Um1f62Uefw' });
        array.push({ first: 'aaaa', second: 'dddd', third: 'Johnnie	', numeric: '2',  random: 'FghkeCpr8g', random2: 'FghkeCpr8g' });
        array.push({ first: 'aaaa', second: 'aaaa', third: 'Malcolm	', numeric: '3',  random: 'FYYDrLuZ5E', random2: 'FYYDrLuZ5E' });
        array.push({ first: 'aaaa', second: 'bbbb', third: 'Colin	', numeric: '4',  random: 'T9GgUdlmFF', random2: 'T9GgUdlmFF' });
        array.push({ first: 'aaaa', second: 'aaaa', third: 'Clinton	', numeric: '5',  random: 'fJvk9XjiN1', random2: 'fJvk9XjiN1' });
        array.push({ first: 'aaaa', second: 'aaaa', third: 'Fred		', numeric: '6',  random: 'zUQb3R7PcX', random2: 'zUQb3R7PcX' });
        array.push({ first: 'bbbb', second: 'cccc', third: 'Delia	', numeric: '7',  random: '3lywEkeQgc', random2: '3lywEkeQgc' });
        array.push({ first: 'bbbb', second: 'dddd', third: 'Carroll	', numeric: '8',  random: 't1h8jEsKlF', random2: 't1h8jEsKlF' });
        array.push({ first: 'bbbb', second: 'cccc', third: 'Olga		', numeric: '9',  random: 'Uj1uOtprLb', random2: 'Uj1uOtprLb' });
        array.push({ first: 'bbbb', second: 'cccc', third: 'Sue		', numeric: '10', random: 'KyfCdeOoSM', random2: 'KyfCdeOoSM' });
        array.push({ first: 'bbbb', second: 'dddd', third: 'Sandra	', numeric: '11', random: 'c5wkCIIc3v', random2: 'c5wkCIIc3v' });
        array.push({ first: 'cccc', second: 'aaaa', third: 'Curtis	', numeric: '12', random: '1wvyagzXPJ', random2: '1wvyagzXPJ' });
        array.push({ first: 'cccc', second: 'cccc', third: 'Annette	', numeric: '13', random: '27nn2tV1BR', random2: '27nn2tV1BR' });
        array.push({ first: 'cccc', second: 'bbbb', third: 'Lyle		', numeric: '14', random: 'fLurPkxer6', random2: 'fLurPkxer6' });
        array.push({ first: 'cccc', second: 'bbbb', third: 'Phillip	', numeric: '15', random: 'X8vIjF5g8x', random2: 'X8vIjF5g8x' });
        array.push({ first: 'dddd', second: 'dddd', third: 'Lucas	', numeric: '16', random: '3aOYmExtFX', random2: '3aOYmExtFX' });
        array.push({ first: 'dddd', second: 'aaaa', third: 'Tracey	', numeric: '17', random: 'hzkheqozOD', random2: 'hzkheqozOD' });
    }
})();