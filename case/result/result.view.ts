namespace $.$$ {
	export class $hyoo_js_perf_case_result extends $.$hyoo_js_perf_case_result {

		sub() {
			if( !this.result() ) return []
			return this.result().error ? [ this.Error() ] : [ this.Stats(), this.Portions() ]
		}
		
		@ $mol_mem
		portions() {
			const result = this.result()
			return [
				... result.frequency ? [ this.Frequency_portion() ] : [],
				... result.memory ? [ this.Memory_portion() ] : [],
				... result.size ? [ this.Size_portion(), this.Deps_portion() ] : [],
			]
		}

		@ $mol_mem
		stats() {
			const result = this.result()
			return [
				... result.frequency ? [ this.Stats_main() ] : [],
				... result.memory ? [ this.Stats_mem() ] : [],
				... result.size ? [ this.Stats_size(), this.Stats_deps() ] : [],
			]
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

		time_total() {
			return $mol_si_short( this.result().time / 1000, 's' )
		}

		memory_total() {
			const val = this.result().memory
			return val ? $mol_si_short( val, 'B' ) : '?B'
		}

		memory_per_iteration() {
			const val = this.result().memory_per_iteration
			return val ? $mol_si_short( val, 'B' ) : '?B'
		}

		size() {
			return this.result().size
		}

		deps() {
			return $mol_si_short( this.result().deps, 'B' )
		}

		frequency_portion() {
			return this.result().frequency_portion
		}

		memory_portion() {
			return this.result().memory_portion
		}

		size_portion() {
			return this.result().size_portion
		}

		deps_portion() {
			return this.result().deps_portion
		}

	}
}
