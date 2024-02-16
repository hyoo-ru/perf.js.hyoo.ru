namespace $.$$ {

	export class $hyoo_js_perf extends $.$hyoo_js_perf {

		@ $mol_mem
		bench_fund() {
			return this.yard().world().Fund( $hyoo_js_perf_bench )
		}
		
		bench_id() {
			return $mol_int62_string_ensure( this.$.$mol_state_arg.value( 'bench' ) )
		}
		
		permalink() {
			return `https://perf.js.hyoo.ru/#!bench=${ this.bench_id() }`
		}
		
		@ $mol_mem
		bench() {
			const id = this.bench_id()
			return id ? this.bench_fund().Item( id ) : null as never
		}
		
		@ $mol_action
		bench_new() {
			const bench = this.bench_fund().make()
			this.$.$mol_state_arg.go({ bench: bench.land.id() })
			return bench
		}
		
		@ $mol_action
		bench_fork() {
			
			const prev = this.bench()
			
			const prefix = this.prefix()
			const postfix = this.postfix()
			const titles = this.titles()
			const prefixes = this.prefixes()
			const sources = this.sources()
			
			const next = this.bench_new()
			
			if( prev ) {
				
				next.steal( prev )
				
			} else {
				
				next.prefix( prefix )
				next.postfix( postfix )
				
				const count = this.cases_count()
				for( let i = 0; i < count; ++i ) {
					
					const case_ = next.case_add()
					
					case_.title( titles[i] ?? '' )
					case_.setup( prefixes[i] ?? '' )
					case_.measure( sources[i] ?? '' )
					
				}
				
			}
			
			return next
		}

		@ $mol_action
		bench_changable() {
			const bench = this.bench()
			if( bench?.changable() ) return bench
			return this.bench_fork()
		}
		
		@ $mol_mem
		titles( next? : string[] ) : string[] {
			
			const bench = this.bench()
			if( bench ) return bench.cases().map( case_ => case_.title() )
			
			return JSON.parse( this.$.$mol_state_arg.value( 'titles' , next === undefined ? undefined : JSON.stringify( next ) ) || '[]' )
		}

		@ $mol_mem
		prefixes( next? : string[] ) : string[] {
			
			const bench = this.bench()
			if( bench ) return bench.cases().map( case_ => case_.setup() )
			
			return JSON.parse( this.$.$mol_state_arg.value( 'prefixes' , next === undefined ? undefined : JSON.stringify( next ) ) || '[]' )
		}

		@ $mol_mem
		sources( next? : string[] ) : string[] {
			
			const bench = this.bench()
			if( bench ) return bench.cases().map( case_ => case_.measure() )
			
			return JSON.parse( this.$.$mol_state_arg.value( 'sources' , next === undefined ? undefined : JSON.stringify( next ) ) || '[]' )
		}

		@ $mol_mem
		bench_title( next? : string ) : string {
			
			if( next === undefined ) {
				
				return this.bench()?.title()
					?? this.$.$mol_state_arg.value( 'title' )
					?? ''
				
			} else {
				
				return this.bench_changable().title( next )
					
			}
			
		}

		menu_title() {
			return this.bench_title() || super.menu_title()
		}

		@ $mol_mem
		prefix( next? : string ) : string {
			
			if( next === undefined ) {
				
				return this.bench()?.prefix()
					?? this.$.$mol_state_arg.value( 'prefix' )
					?? this.$.$mol_state_arg.value( 'common' )
					?? ''
				
			} else {
				
				return this.bench_changable().prefix( next )
					
			}
			
		}

		@ $mol_mem
		postfix( next? : string ) : string {
			
			if( next === undefined ) {
				
				return this.bench()?.postfix()
					?? this.$.$mol_state_arg.value( 'postfix' )
					?? ''
				
			} else {
				
				return this.bench_changable().postfix( next )
					
			}

		}

		case_drop( index: number ) {
			if( ( this.bench()?.cases().length ?? 0 ) <= index ) return
			this.bench_changable().case_drop( index )
		}

		case_dupe( index: number ) {
			if( ( this.bench()?.cases().length ?? 0 ) <= index ) return
			this.bench_changable().case_dupe( index )
		}

		case_swap( index: number ) {
			if( ( this.bench()?.cases().length ?? 0 ) <= index ) return
			this.bench_changable().case_swap( index )
		}

		@ $mol_mem
		cases_count() {
			return Math.max(
				this.prefixes().length,
				this.sources().length,
				this.titles().length,
			)
		}
		
		@ $mol_mem
		cases() {
			return $mol_range2(
				index => this.Case( index ),
				()=> Math.max( 1, this.cases_count() ),
			)
		}
		
		@ $mol_mem_key
		case_title( index : number , next? : string ) {
			
			if( next === undefined ) {
				
				return this.bench()?.cases()[ index ]?.title()
					?? this.titles()[ index ]
					?? ''
				
			} else {
				
				return this.bench_changable().case_ensure( index ).title( next )
					
			}

		}
		
		@ $mol_mem_key
		case_prefix( index : number , next? : string ) {

			if( next === undefined ) {
				
				return this.bench()?.cases()[ index ]?.setup()
					?? this.prefixes()[ index ]
					?? ''
				
			} else {
				
				return this.bench_changable().case_ensure( index ).setup( next )
				
			}
			
		}
		
		@ $mol_mem_key
		source( index : number , next? : string ) {
			
			if( next === undefined ) {
				
				return this.bench()?.cases()[ index ]?.measure()
					?? this.sources()[ index ]
					?? ''
				
			} else {
				
				return this.bench_changable().case_ensure( index ).measure( next )
				
			}
			
		}

		@ $mol_mem_key
		case_sample( index: number ) {
			
			const token = this.token()
			
			const code = this.prefix()
				+ '\n\n' + this.case_prefix( index ) 
				+ '\n\n' + this.source( index )
				+ '\n\n' + this.postfix()
			
			return code.trim().replace( /\{#\}/g , '0' )
		}
		
		@ $mol_mem_key
		case_size( index: number ) {
			return ( this.case_prefix( index ) + '\n' + this.source( index ) )
				.replace( /(\/\*)?\/\/.*$/gm, '' ) // drop inline (pseudo?) comments
				.match( /\w+/g )?.length ?? 0 // calc named tokens
		}
		
		@ $mol_mem_key
		case_deps_names( index: number ) {
			const src = ( this.case_prefix( index ) + '\n' + this.source( index ) )
			const found = src.matchAll( /\$mol_import\.(?:script|module)\s*\(\s*['"]https?:\/\/[^/]*\/((?:@[\w.-]*\/)?[\w.-]*)/g )
			return [ ... found ].map( ([ imp, mod ])=> mod )
		}
		
		@ $mol_mem_key
		case_deps( index: number ) {
			return this.case_deps_names( index )
				.reduce( ( sum, name )=> sum + this.module_size( name ), 0 )
		}
		
		@ $mol_mem_key
		case_measurable( index: number, next?: boolean ) {
			
			const bench = this.bench()
			if( !bench ) return next ?? true
			
			const case_ = bench.cases()[ index ]
			if( !case_ ) return false
			
			const key = `${ this }.case_measurable("${ case_.id() }")`
			return this.$.$mol_state_local.value( key, next ) ?? true
			
		}
		
		@ $mol_mem_key
		module_size( name: string ): number {
			return ( this.$.$mol_fetch.json( `https://bundlephobia.com/api/size?record=true&package=${ name }` ) as any ).gzip
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
					return Math.max( max , level.frequency || 0 )
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
		
		@ $mol_mem
		max_size() {
			return this.measures()
				.map( (_,i)=> this.case_size(i) )
				.reduce( ( max, size )=> Math.max( max, size ), 0 )
		}
		
		@ $mol_mem
		max_deps() {
			return this.measures()
				.map( (_,i)=> {
					try {
						return this.case_deps(i)
					} catch( error ) {
						$mol_fail_log( error )
						return 0
					}
				} )
				.reduce( ( max, size )=> Math.max( max, size ), 0 )
		}
		
		@ $mol_mem_key 
		results( index : number ) {
			
			const measure = this.measures_for( index )
			if( !measure ) return []
			
			return [
				$hyoo_js_perf_stats.create( stats2 => {
					try {
						stats2.size = this.case_size( index )
						stats2.size_portion = this.case_size( index ) / this.max_size()
						stats2.deps = this.case_deps( index )
						stats2.deps_portion = this.case_deps( index ) / this.max_deps()
					} catch( error: any ) {
						$mol_fail_log( error )
						stats2.error = error.message
					}
				} ),
				... measure.map( ( stats )=> $hyoo_js_perf_stats.create( stats2 => {
					stats2.frequency_portion = stats.frequency / this.max_frequency()
					stats2.memory_portion = stats.memory_per_iteration / this.max_memory()
					stats2.memory = stats.memory
					stats2.elapsed = stats.elapsed
					stats2.iterations = stats.iterations
					stats2.error = stats.error
				} ) ),
			]

		}

		@ $mol_memo.method
		token() {
			return Math.random().toString(16).substring(2)
		}

		@ $mol_action
		measure_step( count : number , prefix : string , inner : string , postfix : string ) {

			this.$.$mol_wait_rest()

			const token = this.token()

			let total = - performance.now()

			prefix = prefix.replace( /\{#\}/g , `${ count }` )
			postfix = postfix.replace( /\{#\}/g , `${ count }` )

			inner = Array.from( { length : count }, (_,i)=> inner.replace( /\{#\}/g , `${i}` ) ).join(';\n')

			const source = [
				prefix,
				`const backup_${token} = $mol_wire_auto()`,
				`$mol_wire_auto( null )`,
				`if( window.gc ) gc(), gc()`,
				`let mem_${token} = -performance.memory?.usedJSHeapSize ?? 0`,
				`let time_${token} = -performance.now()`,
				inner,
				`time_${token} += performance.now()`,
				postfix,
				`if( window.gc ) gc(), gc()`,
				`mem_${token} += performance.memory?.usedJSHeapSize ?? 0`,
				`$mol_wire_auto( backup_${token} )`,
				`return { time: time_${token}, mem: window.gc ? mem_${token} : 0 }`,
			].join( ';\n' )

			let func = new Function( '' , source )
			let { time, mem } = func()
			
			total += performance.now()

			return { total , time, mem }

		}

		@ $mol_action
		measure_precise( prefix : string , inner : string , postfix : string ) {

			const one = this.measure_step( 1 , prefix , inner , postfix )
			const iterations_raw = Math.ceil( 1 + ( 1000 - one.total ) / one.time )
			const iterations = Math.min( Math.max( 1 , iterations_raw ) , 100_000 )

			let avg_last = 0
			const times = [] as number[]
			const mems = [] as number[]

			const avg = ( numbs : number[] )=> Math.pow( numbs.reduce( ( a, b )=> a * b ) , 1 / numbs.length )
			const med = ( numbs : number[] )=> numbs.sort( ( l, r )=> l - r )[ numbs.length/2 | 0 ]
			
			while( times.length < 100 ) {
				const { time, mem } = this.measure_step( iterations , prefix , inner , postfix )
				times.push( time )
				mems.push( mem )
				const avg_next = avg( times )
				if( times.length > 4 && Math.abs( avg_next - avg_last ) / avg_next < 0.001 ) break
				avg_last = avg_next
			}
			
			return $hyoo_js_perf_stats.create( stats => {
				stats.elapsed = med( times )
				stats.memory = med( mems )
				stats.iterations = iterations
			} )

		}

		@ $mol_action
		measure_safe( index: number, prefix : string , inner : string , postfix : string ) {

			try {

				return this.measure_precise( prefix , inner , postfix )

			} catch( error: any ) {

				if( error instanceof Promise ) {
					
					const stats = $hyoo_js_perf_stats.create( stats => {
						stats.error = `Measure ${++this._run_iteration}`
					} )
					
					this.measures_for( index , [ stats ] )
					
					$mol_fail_hidden( error )
				}

				$mol_fail_log( error )

				return $hyoo_js_perf_stats.create( stats => {
					stats.error = error.message
					stats.elapsed = 0
					stats.memory = 0
					stats.iterations = Number.NEGATIVE_INFINITY
				} )
				
			}
			
		}
		
		_run_iteration = 0
		@ $mol_action
		iterations_reset() {
			this._run_iteration = 0
		}
		
		@ $mol_mem
		measurable_all() {
			return [ ... this.sources().entries() ]
				.filter( ([ index, inner ])=> inner.trim() )
				.map( ([ index ])=> this.Case_measurable( index ) )
		}

		@ $mol_action
		run() {

			for( const [ index , inner ] of this.sources().entries() ) {
				this.measures_for( index , [] )
			}

			const prefix = this.prefix()
			const prefixes = this.prefixes()
			const postfix = this.postfix()
			const token = this.token()

			for( const [ index , inner ] of this.sources().entries() ) {
				
				if( !inner.trim() ) continue
				if( !this.case_measurable( index ) ) continue
				
				const cold = this.measure_safe(
					index,
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
					index,
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
				this.iterations_reset()
				
			}
			
		}

	}

}
