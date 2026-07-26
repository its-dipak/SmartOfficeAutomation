using AutoMapper;
using SmartOffice.Application.DTOs.Department;
using SmartOffice.Domain.Entities;

namespace SmartOffice.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Department, DepartmentDto>();

        CreateMap<CreateDepartmentDto, Department>();

        CreateMap<UpdateDepartmentDto, Department>();

        CreateMap<Department, UpdateDepartmentDto>();
    }
}