#include<iostream>
#include<vector>
using namespace std;

int leftSum(int arr[],int s, int p){
    int ls=0;
    for(int i=0; i<p; i++){
        ls+=arr[i];
    }
    return ls;
}

int rightSum(int arr[],int e, int p){
    int rs=0;
    for(int i=p+1; i<e; i++){
        rs+=arr[i];
    }
    return rs;
}

int main()
{
    int nums[]={1,7,3,6,5,6};
    int s=0, e=5;
    int p=-1;
    int mid;
    while(s<e){
        mid= s + (e-s)/2;
        if(leftSum(nums,s,e)<rightSum(nums, s, e)){
            s=mid+1;
        }
        else e=mid;
    }
    cout<<s;
}