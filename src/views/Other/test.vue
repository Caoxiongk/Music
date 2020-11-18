<template>
<div>
    <input v-model="value">
    <button @click="btn()">点击</button>
    <p v-for="(item,index) in testList" :key="index">
        {{item}}
    </p>
</div>
</template>

<script>
export default {
    data() {
        return {
            testList: [],
            value: '',
        }
    },

    mounted() {
        if (localStorage.getItem('text')) {
            this.testList = JSON.parse(localStorage.getItem('text'))
        } else {
            this.testList = []
        }
    },

    methods: {
        btn() {
            this.testList.push(this.value)
            localStorage.setItem('text', JSON.stringify(this.testList))
        }
    }
}
</script>
