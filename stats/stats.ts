namespace $ {

	export class $hyoo_js_perf_stats extends $mol_object2 {
		
		elapsed! : number
		iterations! : number
		frequency_portion! : number
		error! : string
		memory! : number
		memory_portion! : number
		size! : number
		size_portion! : number
		deps! : number
		deps_portion! : number

		get time() { return this.elapsed / this.iterations }
		get frequency() { return this.iterations * 1000 / this.elapsed }
		get memory_per_iteration() { return this.memory / this.iterations }

	}
	
}
