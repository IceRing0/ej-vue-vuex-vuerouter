// import {get,post,post_array,post_json} from '../http/axios'
import {get, post_array,post} from '@/http/axios'
export default {
    namespaced:true,
    state:{
        visible:false,
        waiters:[],
        title:"添加员工信息"
        
      },
      //同步
      mutations:{
        showModal(state){
          state.visible = true;
        },
        closeModal(state){
          state.visible = false;
        },
        // 需要接收一个参数，这个参数就是waiters
        refreshWaiters(state,waiters){
          // console.log("state ->" ,state); 
          console.log("waiters",waiters);
          state.waiters = waiters;
        },
        setTitle(state,title){
          state.title = title;
        },
        pageChangeHandler(state,params,currentPage){
          console.log(params.page);
          
        }
        
      },
      //异步
      actions:{
        async batchDeleteWaiters(context,ids){
          let response = await post_array("/waiter/batchDelete",{ids});
          context.dispatch("findAllWaiters")
          return response;
        },
        
        // async findAllWaiters({commit,dispatch,getters,state}){
        async findAllWaiters(context,params){
          if(!params){
            params={
              page:0,
              pageSize:5
            }
          }
          // console.log("context ->" ,context);
          //查询所有员工信息
          let response = await post("/waiter/query",params);
          console.log("response.data",response.data);

          //把信息设置到state.waiters中
          context.commit('refreshWaiters',response.data)
        },
        async saveOrUpdateWaiter({dispatch,commit},waiter){
          //1.提交请求
          let response = await post("/waiter/saveOrUpdate",waiter)
          //2.关闭模态框
          commit("closeModal");
          //3.刷新页面
          dispatch("findAllWaiters");
          //4.提示成功 react
          return response;
        },
        async deleteWaiterById({dispatch},id){
          let response = await get("/waiter/deleteById?id="+id);
          //刷新
          dispatch("findAllWaiters")
          //提示成功
          return response;

        }
      }
}