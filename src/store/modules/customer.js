import request from '@/utils/request'
import {post,post_array} from '@/utils/request'
// import {get, post_array,post} from '@/http/axios'
export default {
  namespaced:true,
  state:{
    visible:false,
    customers:[],
    title:"添加顾客信息",
    loading:false
  },
  getters:{
    countCustomers:(state)=>{
      return state.customers.length;
    },
    // 需要为获取器传递参数的写法
    customerStatusFilter:(state)=>{
      return function(status){
        if(status){
          return state.customers.filter(item=>item.status===status)
        } else {
          return state.customers;
        }
      }
    }
  },
  mutations:{
    showModal(state){
      state.visible = true;
    },
    closeModal(state){
      state.visible = false;
    },
    // 需要接受一个参数，这个参数就是customers
    refreshCustomers(state,customers){
      state.customers = customers;
    },
    setTitle(state,title){
      state.title = title;
    },
    beginLoading(state){
      state.loading = true;
    },
    endLoading(state){
      state.loading = false;
    }
  },
  actions:{
    async batchDeleteCustomers(context,ids){
      let response = await post_array("/customer/batchDelete",{ids});
      context.dispatch("findAllCustomers")
      return response;
    },
    // async findAllCustomers({commit,dispatch,getters,state}){
    async findAllCustomers(context,params){
      context.commit("beginLoading")
      if(!params){
        params = {
          page:0,
          pageSize:5
        }
      }
      // 1. 查询所有顾客信息
      let response = await post("/customer/query",params);
      //alert(JSON.stringify(response));
      // 2. 将顾客信息设置到state.customers中
      context.commit("refreshCustomers",response.data)
      setTimeout(()=>{
        context.commit("endLoading")
      },1000)
    },
    async deleteCustomerById({dispatch},id){
      // 1. 删除顾客信息
      let response = await request.get("/customer/deleteById?id="+id);
      // 2. 刷新
      dispatch("findAllCustomers")
      // 3. 提示成功
      return response;
    },
    async saveOrUpdateCustomer({dispatch,commit},customer){
      // 1. 提交请求
      let response = await post("/customer/saveOrUpdate",customer)
      // 2. 关闭模态
      commit("closeModal");
      // 3. 刷新页面
      dispatch("findAllCustomers");
      // 4. 提示成功 react
      return response;
    }
  }
}