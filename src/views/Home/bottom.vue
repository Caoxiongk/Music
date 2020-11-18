<template>
<div id="bottom">
    <Play />
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'vue-property-decorator';
import Play from '../../components/Play.vue'
@Component({
    components: {
        Play
    }
})

export default class bottom extends Vue {

}
</script>

<style lang="scss">
#bottom {
    position: fixed;
    bottom: 0;
    z-index: 3333;
    width: 100%;
}
</style>
