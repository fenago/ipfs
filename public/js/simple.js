$(function(){
	//logout front part
	$("#logout").on('click',()=>{
		swal({
		  title: 'Are you sure you want to logout?',
		  type: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Yes, log me out!'
		}).then((result) => {
		  if (result.value) {
		    window.location.href="/logout"
		  }
		})
	})


 $('[data-toggle="tooltip"]').tooltip()



})
