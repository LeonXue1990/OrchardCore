function initializeContentPickerFieldEditor(elementId, selectedItems, tenantPath, partName, fieldName, multiple) {

    var vueMultiselect = Vue.component('vue-multiselect', window.VueMultiselect.default);

    new Vue({
        el: '#' + elementId,
        components: { 'vue-multiselect': vueMultiselect },
        data: {
            value: null,
            arrayOfItems: selectedItems,
            options: [],
        },
        computed: {
            selectedIds: function () {
                return this.arrayOfItems.map(function (x) { return x.contentItemId }).join(',');
            },
            isDisabled: function () {
                return this.arrayOfItems.length > 0 && !multiple;
            }
        },
        watch: {
            selectedIds: function () {
                // We add a delay to allow for the <input> to get the actual value
                // before the form is submitted
                setTimeout(function () { $(document).trigger('contentpreview:render') }, 100);
            }
        },
        created: function () {
            var self = this;
            self.asyncFind();
        },
        methods: {
            asyncFind: function (query) {
                var self = this;
                self.isLoading = true;
                var searchUrl = tenantPath + '/ContentPicker?part=' + partName + '&field=' + fieldName;
                if (query) {
                    searchUrl += '&query=' + query;
                }
                fetch(searchUrl).then(function (res) {
                    res.json().then(function (json) {
                        self.options = json;
                        self.isLoading = false;
                    })
                });
            },
            onSelect: function (selectedOption, id) {
                var self = this;

                for (i = 0; i < self.arrayOfItems.length; i++) {
                    if (self.arrayOfItems[i].contentItemId === selectedOption.contentItemId) {
                        return;
                    }
                }

                self.arrayOfItems.push(selectedOption);
            },
            remove: function (item) {
                this.arrayOfItems.splice(this.arrayOfItems.indexOf(item), 1)
            }
        }
    })
}
