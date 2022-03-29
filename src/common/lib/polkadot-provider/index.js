import { setEthAddress, queryAccountBalance } from "@debionetwork/polkadot-provider"
import { checkApiConnection, toFormatDebioCoin } from "./util"

const serviceHandlerMixin = {
  data: () => ({
    isLoading: false,
    isErrors: null 
  }),

  computed: {
    loadingPlaceholder() {
      return this.isLoading ? "Loading Data..." : ""
    }
  },

  methods: {
    /**
     * Adds a new callback function
     * @param args
     * @returns {Array}
     */
    addCallback(args){
      // Add callback if doesn't exist
      if(!(args[args.length - 1] instanceof Function)){
        args.push(() => {
          this.isLoading = false
        })
        return args
      }
      
      const f = args[args.length - 1] 
      // Add new actions on callback
      args[args.length - 1] = () => {
        f()
        this.isLoading = false
      }
      return args
    },

    /**
     * Dispatch wrapper that marks the action as loading & parses errors
     * @param action
     * @param args
     * @returns {Promise<*>}
     */
    async dispatch(action, ...args) {
      this.isLoading = true
      args = this.addCallback(args)      

      try {
        checkApiConnection()
        const response = await action.apply(this, args)
        
        return Promise.resolve(response)
      } catch (error) {
        this.isErrors = error

        console.error(`[${error?.response?.status}] Something went wrong, Please try again later!`)

        return Promise.reject(error)
      }
    }
  }
}

export {
  setEthAddress,
  queryAccountBalance,
  toFormatDebioCoin,
  serviceHandlerMixin
}
