// import {get,post,post_array,post_json} from '../http/axios'
import {get, post_array,post} from '@/http/axios'
export default {
    namespaced:true,
    state:{
        visible:false,
        products:[],
        title:"添加产品信息",
        categories:[]
        
      },
      //同步
      mutations:{
        showModal(state){
          state.visible = true;
        },
        closeModal(state){
          state.visible = false;
        },
        // 需要接收一个参数，这个参数就是products
        refreshProducts(state,products){
          // console.log("state ->" ,state); 
          // console.log("products",products);
          state.products = products;
        },
        
        setTitle(state,title){
          state.title = title;
        }
        
      },
      //异步
      actions:{

        //批量删除
        async batchDeleteProducts(context,ids){
          let response = await post_array("/product/batchDelete",{ids});
          context.dispatch("findAllProducts")
          return response;
        },

        //查询所有产品信息
        async findAllProducts(context,params){
          if(!params){
            params={
              page:0,
              pageSize:5
            }
          }
          let response = await post("/product/queryProductCascadeCategory",params);
          // console.log("response",response.data);
          //把信息设置到state.products中
          context.commit('refreshProducts',response.data)
        },

        //分页查询所有产品信息
        async saveOrUpdateProduct({dispatch,commit},product){
          //1.提交请求
          // console.log(product);
          let response = await post("/product/saveOrUpdate",product)
          //2.关闭模态框
          commit("closeModal");
          //3.刷新页面
          dispatch("findAllProducts");
          //4.提示成功 react
          return response;
        },

        //通过产品ID删除
        async deleteProductById({dispatch},id){
          let response = await get("/product/deleteById?id="+id);
          //刷新
          dispatch("findAllProducts")
          //提示成功
          return response;

        }
      }
}