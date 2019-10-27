import {get,post,post_array} from '@/http/axios'
export default {
  namespaced:true,
  state:{
    visible:false,
    addresses:[],
    title:"添加地址信息",
    customers:[],
    addressPage:[],
    params:{
      page:0,
      pageSize:4,
      name:""
    },
   
  },
  getters:{
    countAddresss:(state)=>{
      return state.addresses.length;
    },
    // 需要为获取器传递参数的写法
    AddressIdFilter:(state)=>{
      return function(id){
        if(id){
          return state.addresses.filter(item=>item.id===id)
        } else {
          return state.addresses;
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
    // 需要接受一个参数，这个参数就是addresses
    refreshAddresses(state,addresses){
      console.log('state->',state);
      state.addresses = addresses;
    },
    setTitle(state,title){
      state.title = title;
    },
    //需要接收一个customers的参数
    refreshCustomers(state,customers){
        console.log('state--------->',state);
        state.customers = customers;
    },
    refreshPage(state,addressPage){
      state.addressPage = addressPage;
  },
  },
  actions:{
      //批量删除
    async batchDeleteAddresses(context,ids){
      let response = await post_array("/address/batchDelete",{ids});
      context.dispatch("findAllAddresses")
      return response;
    },
    // async findAllAddresss({commit,dispatch,getters,state}){
    async findAllAddresses(context){
    //   console.log("context->",context);
      // 1. 查询所有地址信息
      let response = await get("/address/findAll");
      //alert(JSON.stringify(response));
      // 2. 将地址信息设置到state.addresses中
      context.commit("refreshAddresses",response.data)
    },
    async deleteAddressById({dispatch},id){
      // 1. 删除地址信息
      let response = await get("address/deleteById?id="+id);
      // 2. 刷新
      dispatch("findAllAddresses")
      // 3. 提示成功
      return response;
    },
    async saveOrUpdateAddress({dispatch,commit},address){
      // 1. 提交请求
      let response = await post("/address/saveOrUpdate",address)
      // 2. 关闭模态
      commit("closeModal");
      // 3. 刷新页面
      dispatch("findAllAddresses");
      // 4. 提示成功 react
      return response;
    },
    //加载顾客信息
    async loadCustomerData(context){
      console.log("context->",context);
        //1.提交请求
        let response = await get("/customer/findAll")
       //2.将顾客信息设置到state.customers中
       context.commit("refreshCustomers",response.data);
    },
    //根据顾客id查询地址信息
    async findAddressById({commit,dispatch},id){
      if(id){
        let response = await get("/address/findByCustomerId?id="+id)
        commit("refreshAddresses",response.data)
      }else{
        // 2. 刷新
        dispatch("findAllAddresses")
      }
      
        // dispatch("findAllAddresses");
    },
    //分页查询
    async findAllPages(context){
      let response = await post("/address/query",context.state.params)
      console.log("=======",response.data) 
      context.commit("refreshAddresses",response.data.list)     
      context.commit("refreshPage",response.data)     
    }


  }
}