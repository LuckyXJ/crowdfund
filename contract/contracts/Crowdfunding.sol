// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.5.0;

contract Crowdfunding {
    
    struct Project{
        uint id; // 项目id
        address user; // 众筹发起人的地址
        address payable to; // 收款地址
        uint currentAmount; // 当前筹集的金额
        uint maxAmount; // 最大筹集金额
        uint currentPeople; // 当前众筹人数
        uint maxPeople; // 最大众筹人数
        mapping(address => uint) fromDetail; // 记录众筹者转入的金额
        address payable[] allFroms; // 存储所有众筹者的地址
        uint status; // 众筹状态：1 - 进行中，2 - 已达成目标，0 - 已关闭
        
    }
    
    Project[] public projects; // 所有众筹项目

    event NewProject(address from, address to, uint maxAmount, uint maxPeople); // 新建众筹项目事件
    event NewContribution(address from, uint pid, uint amount); // 新众筹事件
    event CloseProject(uint pid); // 终止众筹项目事件

    // 添加项目 参数:收款地址, 最大众筹金额, 最大众筹人数
    function add(address payable _to, uint _maxAmount, uint _maxPeople) public returns(bool){
        require(_maxAmount > 0, "Amount must be greater than 0"); // 检查最大众筹金额是否大于0
        require(_maxPeople > 0, "People must be greater than 0"); // 检查最大众筹人数是否大于0
        projects.length++; // 新建一个项目
        Project storage p = projects[projects.length - 1]; // 获取新建的项目
        p.id = projects.length - 1; // 设置项目id
        p.to = _to; // 设置收款地址
        p.user = msg.sender; // 设置众筹发起人的地址
        p.maxAmount =  _maxAmount; // 设置最大众筹金额
        p.maxPeople = _maxPeople; // 设置最大众筹人数
        p.status = 1; // 设置众筹状态为进行中
        emit NewProject(msg.sender, _to, _maxAmount, _maxPeople); // 触发新建众筹项目事件
        return true;
    }
    
    // 捐款
    function contribution(uint _pid) public payable returns(bool){
        Project storage p = projects[_pid];
        require(msg.value > 0, "Amount must be greater than 0"); // 检查捐款金额是否大于0
        require(p.status!= 0, "Crowdfunding has stopped"); // 检查众筹状态是否为进行中
        require(p.currentPeople + 1 <= p.maxPeople, "Exceed the maximum number of people"); // 检查是否超过最大众筹人数

        if(p.fromDetail[msg.sender] == 0){
            p.currentPeople += 1; // 如果众筹者之前没有捐款过，则增加当前众筹人数
            p.allFroms.push(msg.sender); // 将众筹者的地址加入到众筹者列表中
        }
        p.fromDetail[msg.sender] += msg.value; // 记录众筹者转入的金额
        
        uint newAmount =  p.currentAmount + msg.value; // 计算新的筹集金额
        
        if(newAmount >= p.maxAmount){
            p.status = 2; // 如果筹集金额达到了最大众筹金额，则设置众筹状态为已达成目标
            p.to.transfer(newAmount); // 将筹集的金额转入收款地址
        } else if(p.currentPeople== p.maxPeople){
            p.status = 0; // 如果众筹人数已达到最大众筹人数，则设置众筹状态为已关闭
            closeProjectInternal(_pid); // 关闭项目
        }
        p.currentAmount += msg.value; // 更新当前筹集金额
        emit NewContribution(msg.sender, _pid, msg.value); // 触发新众筹事件
        return true;
    }
    
    // 关闭项目 
    function closeProject(uint _pid) public returns (bool){
        Project storage p = projects[_pid];
        require(p.user == msg.sender, "You don't have permission"); // 检查是否是众筹发起人
        require(p.status != 0, "Crowdfunding has stopped"); // 检查众筹状态是否为进行中
        closeProjectInternal(_pid); // 关闭项目
        p.status = 0; // 设置众筹状态为已关闭
    }

    // 内部函数，用于关闭项目
    function closeProjectInternal(uint _pid) internal returns (bool){
        Project storage p = projects[_pid];
        mapping(address => uint) storage _fromDetail = p.fromDetail;
        address payable[] memory _allFroms= p.allFroms;
        for(uint i; i < _allFroms.length; i++){
            address payable account = _allFroms[i]; // 获取众筹者的地址
            uint amount = _fromDetail[account]; // 获取众筹者转入的金额
            account.transfer(amount); // 将众筹者转入的金额返回给众筹者
        }
        emit CloseProject(_pid); // 触发终止众筹项目事件
    }
    
    // 获取众筹项目的总长度
    function projectLength() public view returns(uint){
        return projects.length;
    }
}