namespace $.$$ {

	const wait_rest = $mol_fiber_sync( ()=> new Promise( done => new $mol_after_work( 16 , ()=> done( null ) ) ) )

	export class $hyoo_js_perf_stats extends $mol_object2 {
		
		elapsed! : number
		iterations! : number
		frequency_portion! : number
		error! : string
		memory! : number
		memory_portion! : number

		get time() { return this.elapsed / this.iterations }
		get frequency() { return this.iterations * 1000 / this.elapsed }
		get memory_per_iteration() { return this.memory / this.iterations }

	}

	export class $hyoo_js_perf extends $.$hyoo_js_perf {

		@ $mol_mem
		prefixes( next? : string[] ) : string[] {
			return JSON.parse( this.$.$mol_state_arg.value( 'prefixes' , next === undefined ? undefined : JSON.stringify( next ) ) || '[]' )
		}

		@ $mol_mem
		sources( next? : string[] ) : string[] {
			return JSON.parse( this.$.$mol_state_arg.value( 'sources' , next === undefined ? undefined : JSON.stringify( next ) ) || '[]' )
		}

		@ $mol_mem
		prefix( next? : string ) : string {
			if( next === undefined ) {
				return this.$.$mol_state_arg.value( 'prefix' ) || this.$.$mol_state_arg.value( 'common' ) || ''
			} else {
				this.$.$mol_state_arg.value( 'prefix' , next )
				this.$.$mol_state_arg.value( 'common' , null )
				return next
			}
		}

		@ $mol_mem
		postfix( next? : string ) : string {
			return this.$.$mol_state_arg.value( 'postfix' , next ) || ''
		}

		permalink() {
			const win = this.$.$mol_dom_context
			return 'https://tinyurl.com/create.php?url=' + encodeURIComponent( win.location.href )
		}

		cases_count() {
			return Math.max(
				this.prefixes().filter( Boolean ).length,
				this.sources().filter( Boolean ).length,
			)
		}
		
		cases() {
			return $mol_range2(
				index => this.Case( index ),
				()=> this.cases_count() + 1,
			)
		}

		case_prefix( index : number , next? : string ) {

			let prefixes = this.prefixes()
			if( next === undefined ) return prefixes[ index ] || ''

			prefixes = prefixes.slice()
			prefixes[ index ] = next
			this.prefixes( prefixes )

			return next
		}

		source( index : number , next? : string ) {

			let sources = this.sources()
			if( next === undefined ) return sources[ index ] || ''

			sources = sources.slice()
			sources[ index ] = next
			this.sources( sources )

			return next
		}

		@ $mol_mem_key
		measures_for( index : number , next? : $hyoo_js_perf_stats[] ) {
			this.prefix()
			this.postfix()
			this.sources()
			this.prefixes()
			return next || []
		}

		@ $mol_mem
		measures() {
			return this.sources().map( ( _ , index )=> this.measures_for( index ) )
		}

		@ $mol_mem
		max_frequency() {
			return this.measures().reduce( ( max , measure )=> {
				return Math.max( max , measure.reduce( ( max , level )=> {
					return Math.max( max , level.frequency )
				} , 0 ) )
			} , 0 )
		}
		
		@ $mol_mem
		max_memory() {
			return this.measures().reduce( ( max , measure )=> {
				return Math.max( max , measure.reduce( ( max , level )=> {
					return Math.max( max , level.memory_per_iteration )
				} , 0 ) )
			} , 0 )
		}
		
		@ $mol_mem_key 
		results( index : number ) {
			
			const measure = this.measures_for( index )
			if( !measure ) return []
			
			return measure.map( ( stats )=> $hyoo_js_perf_stats.create( stats2 => {
				stats2.frequency_portion = stats.frequency / this.max_frequency()
				stats2.memory = stats.memory
				stats2.memory_portion = stats.memory_per_iteration / this.max_memory()
				stats2.elapsed = stats.elapsed
				stats2.iterations = stats.iterations
				stats2.error = stats.error
			} ) )

		}

		@ $mol_memo.method
		token() {
			return Math.random().toString(16).substring(2)
		}

		@ $mol_fiber.method
		measure_step( count : number , prefix : string , inner : string , postfix : string ) {

			wait_rest()

			const token = this.token()

			let total = - performance.now()

			prefix = prefix.replace( /\{#\}/g , `${ count }` )
			postfix = postfix.replace( /\{#\}/g , `${ count }` )

			inner = Array.from( { length : count }, (_,i)=> inner.replace( /\{#\}/g , `${i}` ) ).join(';\n')

			const source = [
				prefix,
				`if( window.gc ) gc()`,
				`let mem_${token} = -performance.memory?.usedJSHeapSize ?? 0`,
				`let time_${token} = -performance.now()`,
				inner,
				`time_${token} += performance.now()`,
				postfix,
				`if( window.gc ) gc()`,
				`mem_${token} += performance.memory?.usedJSHeapSize ?? 0`,
				`return { time: time_${token}, mem: window.gc ? mem_${token} : 0 }`,
			].join( ';\n' )

			let func = new Function( '' , source )
			let { time, mem } = func()
			
			total += performance.now()

			return { total , time, mem }

		}

		@ $mol_fiber.method
		measure_precise( prefix : string , inner : string , postfix : string ) {

			const one = this.measure_step( 1 , prefix , inner , postfix )
			const iterations_raw = Math.ceil( 1 + ( 1000 - one.total ) / one.time )
			const iterations = Math.min( Math.max( 1 , iterations_raw ) , 100_000 )

			let avg_last = 0
			const times = [] as number[]
			const mems = [] as number[]

			const avg = ( numbs : number[] )=> Math.pow( numbs.reduce( ( a, b )=> a * b ) , 1 / numbs.length )
			
			while( times.length < 100 ) {
				const { time, mem } = this.measure_step( iterations , prefix , inner , postfix )
				times.push( time )
				mems.push( mem )
				const avg_next = avg( times )
				if( times.length > 4 && Math.abs( avg_next - avg_last ) / avg_next < 0.001 ) break
				avg_last = avg_next
			}
			
			return $hyoo_js_perf_stats.create( stats => {
				stats.elapsed = Math.min( ... times )
				stats.memory = Math.max( ... mems )
				stats.iterations = iterations
			} )

		}

		@ $mol_fiber.method
		measure_safe( prefix : string , inner : string , postfix : string ) {

			try {

				return this.measure_precise( prefix , inner , postfix )

			} catch( error ) {

				if( 'then' in error ) $mol_fail_hidden( error )

				console.error( error )

				return $hyoo_js_perf_stats.create( stats => {
					stats.error = error.message
					stats.elapsed = 0
					stats.iterations = Number.NEGATIVE_INFINITY
				} )
				
			}
			
		}

		@ $mol_fiber.method
		run() {

			for( const [ index , inner ] of this.sources().entries() ) {
				this.measures_for( index , [] )
			}

			const prefix = this.prefix()
			const prefixes = this.prefixes()
			const postfix = this.postfix()
			const token = this.token()

			for( const [ index , inner ] of this.sources().entries() ) {

				const cold = this.measure_safe(
					[
						'/*cold*/',
						prefix,
						prefixes[index] || '',
						`let accum_${token}`,
						`const case_${token} = iter_${token} => {\n accum_${token} = iter_${token} \n};`,
					].join(';\n'),
					`case_${token}({#});\n` + inner,
					postfix,
				)

				const hot = this.measure_safe(
					[
						'/*hot*/',
						prefix,
						prefixes[index] || '',
						`let accum_${token}`,
						`const case_${token} = iter_${token} => {\n ${ inner.replace( /\{#\}/g , `iter_${token}` ) } \n};`,
					].join(';\n'),
					`case_${token}({#})`,
					postfix,
				)

				this.measures_for( index , [ cold , hot ] )

			}

		}

	}

	export class $hyoo_js_perf_case extends $.$hyoo_js_perf_case {

		@ $mol_mem
		result_rows() {
			return [ this.Result( 0 ) , this.Result( 1 ) ]
			// return $mol_range2( level => this.Result( level ) , ()=> this.results().length )
		}

		result( level : number ) {
			return this.results()[ level ]
		}

		result_title( level : number ) {
			return [ '❄' , '🔥' ][ level ] ?? ''
		}

	}

	export class $hyoo_js_perf_case_result extends $.$hyoo_js_perf_case_result {

		sub() {
			if( !this.result() ) return []
			return this.result().error ? [ this.Error() ] : [ this.Stats() , this.Portion() ]
		}

		error() {
			return `${ this.result().error }`
		}

		iterations() {
			return $mol_si_short( this.result().iterations, 'It' )
		}

		frequency() {
			return $mol_si_short( this.result().frequency, 'Hz' )
		}

		time() {
			return $mol_si_short( this.result().time / 1000, 's' )
		}

		memory() {
			return $mol_si_short( this.result().memory, 'B' )
		}

		memory_per_iteration() {
			return $mol_si_short( this.result().memory_per_iteration, 'B' )
		}

		portion() {
			return this.result().frequency_portion
		}

	}

}
